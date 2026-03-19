import { AppDataSource } from "../config/datasource";
import { Submission } from "../models/submission.model";
import { Question } from "../models/question.model";
import { Option } from "../models/option.model";
import { CreateSubmissionDTO } from "../schemas/submission.schemas";
import { NotFoundError } from "../utils/api.errors";
import { participantService } from "./participant.services";
import { questionService } from "./question.services";
import { optionService } from "./option.services";
import { io } from "../app";

/**
 * SubmissionService handles recording participant answers
 * Each submission represents ONE answer to ONE question by ONE participant
 * A participant can have multiple submissions (one per question)
 * Emits real-time feedback to all participants in the session via WebSocket
 */
class SubmissionService {
  private submissionRepository = AppDataSource.getRepository(Submission);

  async createSubmission(data: CreateSubmissionDTO): Promise<Submission> {
    // Fetch participant with quiz session
    const participant = await participantService.getParticipant(
      data.participantId,
    );

    // Fetch question
    const question = await questionService.getQuestion(data.questionId);

    // Fetch selected answer (if provided)
    let selectedAnswer: Option | null = null;
    let isCorrect = false;
    let pointsEarned = 0;

    if (data.selectedAnswerId) {
      selectedAnswer = await optionService.getOption(data.selectedAnswerId);

      // Check if answer is correct
      isCorrect = selectedAnswer.isCorrect;
      pointsEarned = isCorrect ? 1 : 0; // Award 1 point for correct answer
    }

    // Create submission
    const submission = new Submission();
    submission.participant = participant;
    submission.question = question;
    if (selectedAnswer) {
      submission.selectedAnswer = selectedAnswer;
    }
    submission.isCorrect = isCorrect;
    submission.pointsEarned = pointsEarned;

    const savedSubmission = await this.submissionRepository.save(submission);

    // Calculate and update participant score
    const allSubmissions = await this.submissionRepository.find({
      where: { participant: { id: data.participantId as any } },
    });

    const totalScore = allSubmissions.reduce(
      (sum, sub) => sum + sub.pointsEarned,
      0,
    );

    await participantService.updateParticipantScore(
      data.participantId,
      totalScore,
    );

    // Emit real-time submission feedback to all participants in the session
    // This allows live updates of answers and scores across the room
    const sessionId = participant.quizSessionId;
    io.to(`session-${sessionId}`).emit("submissionFeedback", {
      participantId: data.participantId,
      questionId: data.questionId,
      isCorrect: isCorrect,
      pointsEarned: pointsEarned,
      updatedScore: totalScore,
      totalSubmissions: allSubmissions.length,
      timestamp: new Date(),
    });

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
