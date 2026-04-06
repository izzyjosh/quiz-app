import { socket } from "./socket";
import { SOCKET_EVENTS } from "./socketEvents";

type ActiveParticipantsPayload = {
  count: number;
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
    }
  },
  disconnect() {
    if (socket.connected) {
      socket.disconnect();
    }
  },
  joinSession(sessionId: string, userId: string) {
    socket.emit(SOCKET_EVENTS.JOIN_SESSION, { sessionId, userId });
  },
  leaveSession(sessionId: string, userId: string) {
    socket.emit(SOCKET_EVENTS.LEAVE_SESSION, { sessionId, userId });
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
};
