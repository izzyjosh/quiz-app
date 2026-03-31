import { apiFetcher } from "./api";

interface createQuiz {
  title: string;
  description: string;
}

export type QuizRecord = {
  id: string;
  title: string;
  category: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  description?: string;
  questionCount: number;
  liveNow: number;
  upcoming: number;
  totalRuns: number;
};

export type SessionRecord = {
  id: string;
  quizId: string;
  status: "waiting" | "started" | "finished";
  currentQuestionIndex: number;
  startTime?: string | null;
  scheduledStartTime?: string | null;
  createdByUserId?: string | null;
  createdAt: string;
};

export type ActiveAndUpcomingSessionsResponse = {
  activeSessions: SessionRecord[];
  upcomingSessions: SessionRecord[];
};

export const getQuizzes = async (): Promise<QuizRecord[]> => {
  const res = await apiFetcher("/quizzes/");
  if (!res.ok) {
    throw new Error("Failed to fetch quizzes");
  }
  const payload = await res.json();
  return payload.data;
};

export const createQuiz = async (quizData: createQuiz) => {
  const res = await apiFetcher("/quizzes", {
    method: "POST",
    body: JSON.stringify(quizData),
  });
  if (!res.ok) {
    throw new Error("Failed to create quiz");
  }
  const payload = await res.json();
  return payload.data;
};

// quiz session related functions
interface createQuizSession {
  quizId: string;
  scheduledStartTime?: string; // ISO string
}

export const createQuizSession = async (sessionData: createQuizSession) => {
  const res = await apiFetcher("/sessions/start", {
    method: "POST",
    body: JSON.stringify(sessionData),
  });
  if (!res.ok) {
    throw new Error("Failed to create quiz session");
  }
  const payload = await res.json();
  return payload.data;
};

// get all upcoming and active sessions
export const getActiveAndUpcomingSessions =
  async (): Promise<ActiveAndUpcomingSessionsResponse> => {
    const res = await apiFetcher("/sessions/upcoming-active");
    if (!res.ok) {
      throw new Error("Failed to fetch quiz sessions");
    }
    const payload = await res.json();
    return payload.data;
  };
