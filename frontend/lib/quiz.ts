import { apiFetcher } from "./api";

interface createQuiz {
  title: string;
  description?: string;
  timeLimit: number;
  category: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
}

type CreateQuestionPayload = {
  text: string;
  order: number;
};

type CreateOptionPayload = {
  text: string;
  isCorrect: boolean;
};

export type PublishQuestionPayload = {
  text: string;
  order: number;
  options: CreateOptionPayload[];
};

export type PublishQuizPayload = {
  quiz: createQuiz;
  questions: PublishQuestionPayload[];
};

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
  sessionName?: string | null;
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

export type SessionStatsResponse = {
  activeParticipants: number;
  activeSessions: number;
  totalQuizTemplates: number;
};

export type CreateQuizSessionPayload = {
  sessionName: string;
  quizId: string;
  scheduledStartTime?: string;
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

export const createQuestion = async (
  quizId: string,
  questionData: CreateQuestionPayload,
) => {
  const res = await apiFetcher(`/quizzes/${quizId}/questions`, {
    method: "POST",
    body: JSON.stringify(questionData),
  });

  if (!res.ok) {
    throw new Error("Failed to create question");
  }

  const payload = await res.json();
  return payload.data;
};

export const createOption = async (
  quizId: string,
  questionId: string,
  optionData: CreateOptionPayload,
) => {
  const res = await apiFetcher(
    `/quizzes/${quizId}/questions/${questionId}/options`,
    {
      method: "POST",
      body: JSON.stringify(optionData),
    },
  );

  if (!res.ok) {
    throw new Error("Failed to create option");
  }

  const payload = await res.json();
  return payload.data;
};

export const createQuizWithQuestions = async ({
  quiz,
  questions,
}: PublishQuizPayload) => {
  const createdQuiz = await createQuiz(quiz);

  for (const question of questions) {
    const createdQuestion = await createQuestion(createdQuiz.id, {
      text: question.text,
      order: question.order,
    });

    await Promise.all(
      question.options.map((option) =>
        createOption(createdQuiz.id, createdQuestion.id, option),
      ),
    );
  }

  return createdQuiz;
};

// quiz session related functions
export const createQuizSession = async (
  sessionData: CreateQuizSessionPayload,
): Promise<SessionRecord> => {
  const res = await apiFetcher("/sessions/start", {
    method: "POST",
    body: JSON.stringify(sessionData),
  });
  if (!res.ok) {
    const details = await res.text();
    throw new Error(
      details || `Failed to create quiz session (status ${res.status})`,
    );
  }
  const payload = await res.json();
  return payload.data;
};

export const activateQuizSession = async (
  sessionId: string,
): Promise<SessionRecord> => {
  const res = await apiFetcher(`/sessions/${sessionId}/activate`, {
    method: "POST",
  });

  if (!res.ok) {
    throw new Error("Failed to activate quiz session");
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

export const getSessionStats = async (): Promise<SessionStatsResponse> => {
  const res = await apiFetcher("/sessions/stats");
  if (!res.ok) {
    throw new Error("Failed to fetch session stats");
  }
  const payload = await res.json();
  return payload.data;
};
