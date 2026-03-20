import { AppDataSource } from "../config/datasource";
import { QuizSession } from "../models/quizsession.model";
import { quizSessionService } from "../services/quiz-session.serverices";

/**
 * Automatically activate quiz sessions when their scheduled time reaches
 * This function should be called periodically (e.g., every minute)
 * Uses the quizSessionService.autoActivateSession for proper session handling
 */
export const autoActivateSessions = async (): Promise<void> => {
  try {
    const quizSessionRepository = AppDataSource.getRepository(QuizSession);
    const now = new Date();

    // Find all waiting sessions with a scheduledStartTime that has passed
    const sessionsToActivate = await quizSessionRepository.find({
      where: {
        status: "waiting",
      },
    });

    for (const session of sessionsToActivate) {
      if (
        session.scheduledStartTime &&
        session.scheduledStartTime <= now &&
        session.status === "waiting"
      ) {
        // Use the service to activate the session
        await quizSessionService.autoActivateSession(session.id as any);
        console.log(`Auto-activated session: ${session.id}`);
      }
    }
  } catch (error) {
    console.error("Error in autoActivateSessions:", error);
  }
};
