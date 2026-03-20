import { AppDataSource } from "../config/datasource";
import { Submission } from "../models/submission.model";
import { CreateSubmissionDTO } from "../schemas/submission.schemas";
import { NotFoundError, BadRequestError } from "../utils/api.errors";
import { participantService } from "./participant.services";
import { questionService } from "./question.services";
import { optionService } from "./option.services";
import { io } from "../app";
import { leaderboardService } from "./leaderboard.services";
import { quizSessionService } from "./quiz-session.serverices";

/**
 * SubmissionService handles recording participant answers
 * Each submission represents ONE answer to ONE question by ONE participant
 * A participant can have multiple submissions (one per question)
 * Emits real-time feedback to all participants in the session via WebSocket
 */
class SubmissionService {
  private submissionRepository = AppDataSource.getRepository(Submission);
  private leaderboardBroadcastTimers = new Map<string, NodeJS.Timeout>();

  private isUniqueViolationError(error: unknown): boolean {
    return (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "23505"
    );
  }

  private scheduleLeaderboardBroadcast(sessionId: string): void {
    if (this.leaderboardBroadcastTimers.has(sessionId)) {
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const leaderboard = await leaderboardService.getLeaderboard(sessionId);
        io.to(`session-${sessionId}`).emit("leaderboardUpdate", {
          leaderboard,
        });
      } finally {
        this.leaderboardBroadcastTimers.delete(sessionId);
      }
    }, 250);

    this.leaderboardBroadcastTimers.set(sessionId, timer);
  }

  async createSubmission(data: CreateSubmissionDTO): Promise<Submission> {
    // Parallel fetch: Get participant, question, and existing submission simultaneously
    const [participant, question, selectedAnswer] = await Promise.all([
      participantService.getParticipant(data.participantId),
      questionService.getQuestion(data.questionId),
      data.selectedAnswerId
        ? optionService.getOption(data.selectedAnswerId)
        : Promise.resolve(null),
    ]);

    // Validate session is still active (not finished)
    const session = await quizSessionService.getSession(
      participant.quizSessionId,
    );
    if (session.status === "finished") {
      throw new BadRequestError("Quiz session has ended");
    }

    // Determine correctness and points
    const isCorrect = selectedAnswer?.isCorrect || false;
    const pointsEarned = isCorrect ? 1 : 0;

    // Create submission using database transaction for atomicity
    const submission = new Submission();
    submission.participant = participant;
    submission.question = question;
    if (selectedAnswer) {
      submission.selectedAnswer = selectedAnswer;
    }
    submission.isCorrect = isCorrect;
    submission.pointsEarned = pointsEarned;

    let savedSubmission: Submission;
    try {
      savedSubmission = await this.submissionRepository.save(submission);
    } catch (error) {
      if (this.isUniqueViolationError(error)) {
        throw new BadRequestError(
          "You have already answered this question. Answers cannot be changed.",
        );
      }
      throw error;
    }

    // Keep leaderboard and rank in Redis sorted set to reduce DB pressure
    await leaderboardService.ensureMember(
      participant.quizSessionId,
      participant.id,
    );
    if (isCorrect) {
      await leaderboardService.incrementScore(
        participant.quizSessionId,
        participant.id,
        1,
      );
    }

    const [totalScore, userRank] = await Promise.all([
      leaderboardService.getUserScore(participant.quizSessionId, participant.id),
      leaderboardService.getUserRank(participant.quizSessionId, participant.id),
    ]);

    // Persist participant score for historical/query consistency
    await participantService.updateParticipantScore(data.participantId, totalScore);

    // Send answer verification result and rank to ONLY this participant
    io.to(`participant-${participant.userId}`).emit("submissionFeedback", {
      questionId: data.questionId,
      isCorrect: isCorrect,
      pointsEarned: pointsEarned,
      updatedScore: totalScore,
      userRank,
    });

    // Broadcast leaderboard to all participants in session (only if answer was correct)
    if (isCorrect) {
      this.scheduleLeaderboardBroadcast(participant.quizSessionId);
    }

    return savedSubmission;
  }

  async getParticipantSubmissions(
    participantId: string,
  ): Promise<Submission[]> {
    const submissions = await this.submissionRepository.find({
      where: { participant: { id: participantId as any } },
      relations: ["question", "selectedAnswer", "participant"],
      order: { createdAt: "ASC" },
    });

    if (submissions.length === 0) {
      throw new NotFoundError("No submissions found for this participant");
    }

    return submissions;
  }

  async getQuestionSubmission(
    participantId: string,
    questionId: string,
  ): Promise<Submission | null> {
    return await this.submissionRepository.findOne({
      where: {
        participant: { id: participantId as any },
        question: { id: questionId },
      },
      relations: ["question", "selectedAnswer"],
    });
  }
}

export const submissionService = new SubmissionService();
