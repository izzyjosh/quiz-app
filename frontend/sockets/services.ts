import { socket } from "./socket";
import { SOCKET_EVENTS } from "./socketEvents";

type SessionStartingSoonPayload = {
  status: "starting";
  remainingTime: number;
  message?: string;
};

type NewQuestionPayload = {
  question: {
    questionId: string;
    text: string;
    options: Array<{
      id: string;
      text: string;
    }>;
    timeLimit: number;
    startTime: string;
    endsAt: string;
  };
  currentQuestionIndex: number;
};

type ActiveParticipantsPayload = {
  count: number;
};

type QuizEndPayload = {
  reason: "completed" | "ended";
};

type LeaderboardEntry = {
  participantId: string;
  score: number;
};

type LeaderboardUpdatePayload = {
  leaderboard: LeaderboardEntry[];
};

type ParticipantJoinedPayload = {
  participantId: string;
  timestamp: string;
};

export type SessionStatsPayload = {
  activeParticipants: number;
  activeSessions: number;
  totalQuizTemplates: number;
};

export const socketService = {
  connect() {
    if (!socket.connected) {
      socket.connect();
      return socket.id;
    }
  },
  disconnect() {
    if (socket.connected) {
      socket.disconnect();
    }
  },
  joinSession(sessionId: string) {
    socket.emit(SOCKET_EVENTS.JOIN_SESSION, sessionId);
  },
  leaveSession(userId: string) {
    socket.emit("leaveParticipant", userId);
  },

  onActiveParticipants(callback: (data: ActiveParticipantsPayload) => void) {
    socket.on(SOCKET_EVENTS.ACTIVE_PARTICIPANTS, callback);

    return () => {
      socket.off(SOCKET_EVENTS.ACTIVE_PARTICIPANTS, callback);
    };
  },
  onLiveSession(callback: (data: { sessionId: string }) => void) {
    socket.on(SOCKET_EVENTS.LIVE_SESSION, callback);
    return () => {
      socket.off(SOCKET_EVENTS.LIVE_SESSION, callback);
    };
  },
  onQuizCountUpdated(callback: (count: number) => void) {
    socket.on(SOCKET_EVENTS.QUIZ_COUNT_UPDATE, callback);
    return () => {
      socket.off(SOCKET_EVENTS.QUIZ_COUNT_UPDATE, callback);
    };
  },

  onSessionStatsUpdated(callback: (data: SessionStatsPayload) => void) {
    socket.on(SOCKET_EVENTS.SESSION_STATS_UPDATE, callback);
    return () => {
      socket.off(SOCKET_EVENTS.SESSION_STATS_UPDATE, callback);
    };
  },

  onSessionListUpdated(callback: () => void) {
    socket.on(SOCKET_EVENTS.SESSION_LIST_UPDATED, callback);
    return () => {
      socket.off(SOCKET_EVENTS.SESSION_LIST_UPDATED, callback);
    };
  },

  onLiveSessionRemoved(callback: (data: { sessionId: string }) => void) {
    socket.on(SOCKET_EVENTS.LIVE_SESSION_REMOVED, callback);
    return () => {
      socket.off(SOCKET_EVENTS.LIVE_SESSION_REMOVED, callback);
    };
  },

  onQuizEnd(callback: (data: QuizEndPayload) => void) {
    socket.on("quiz:end", callback);
    return () => {
      socket.off("quiz:end", callback);
    };
  },

  onLeaderboardUpdate(callback: (data: LeaderboardUpdatePayload) => void) {
    socket.on("leaderboardUpdate", callback);
    return () => {
      socket.off("leaderboardUpdate", callback);
    };
  },

  onParticipantJoined(callback: (data: ParticipantJoinedPayload) => void) {
    socket.on("participantJoined", callback);
    return () => {
      socket.off("participantJoined", callback);
    };
  },

  // quiz session events

  onSessionStartingSoon(callback: (data: SessionStartingSoonPayload) => void) {
    socket.on(SOCKET_EVENTS.SESSION_STARTING_SOON, callback);
    return () => {
      socket.off(SOCKET_EVENTS.SESSION_STARTING_SOON, callback);
    };
  },

  onNewQuestion(callback: (data: NewQuestionPayload) => void) {
    socket.on(SOCKET_EVENTS.NEW_QUESTION, callback);
    return () => {
      socket.off(SOCKET_EVENTS.NEW_QUESTION, callback);
    };
  },
};
