import { Server } from "socket.io";

/**
 * WebSocket event handlers for real-time quiz session updates
 * Clients join session rooms and receive live submission feedback
 */

export const activeParticipants = new Map<string, Set<string>>(); // sessionId -> Set of participantIds
let socketServer: Server | null = null;

export type SessionStatsPayload = {
  activeParticipants: number;
  activeSessions: number;
  totalQuizTemplates: number;
};

export function setSocketServer(io: Server): void {
  socketServer = io;
}

export function emitTotalQuizCount(count: number): void {
  socketServer?.emit("quizCountUpdated", { count });
}

export function emitSessionStatsUpdated(stats: SessionStatsPayload): void {
  socketServer?.emit("sessionStatsUpdated", stats);
}

function getTotalActiveParticipants(): number {
  let count = 0;

  for (const participants of activeParticipants.values()) {
    count += participants.size;
  }

  return count;
}

export function registerSocketHandlers(io: Server): void {
  setSocketServer(io);

  io.on("connection", (socket) => {
    console.log("A client connected: " + socket.id);

    /**
     * joinSession - User joins a specific quiz session room
     * Event emitted from client when they start taking a quiz
     * All users in the same session will receive real-time updates
     */
    socket.on("joinSession", (sessionId) => {
      const room = `session-${sessionId}`;

      console.log(`Client ${socket.id} joining session: ${sessionId}`);

      socket.join(room);

      // Notify other participants that a new user joined
      socket.to(room).emit("participantJoined", {
        participantId: socket.id,
        timestamp: new Date(),
      });

      if (!activeParticipants.has(sessionId)) {
        activeParticipants.set(sessionId, new Set());
      }
      activeParticipants.get(sessionId)?.add(socket.id);

      socket.data.sessionId = sessionId;

      io.emit("activeParticipants", {
        count: getTotalActiveParticipants(),
      });

      io.emit("liveSessions", {
        count: activeParticipants.size,
      });
    });

    socket.on("leaveParticipant", (userId) => {
      console.log(`Client ${socket.id} leaving participant room: ${userId}`);

      const sessionId = socket.data.sessionId;
      if (!sessionId) return;

      const room = `session-${sessionId}`;
      const active = activeParticipants.get(sessionId);
      if (!active) return;

      active.delete(userId);

      if (active.size === 0) {
        activeParticipants.delete(sessionId);
      }
    });

    /**
     * submissionFeedback - Real-time feedback when a participant submits an answer
     * This event is emitted from the SubmissionService and broadcast to all room members
     * Contains: participantId, questionId, isCorrect, pointsEarned, updatedScore, etc.
     */
    socket.on("submissionFeedback", (data) => {
      console.log(
        `Submission feedback received for session: ${data.sessionId}`,
      );
      console.log(data);
      // The service handles broadcasting this to all clients in the room
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected: " + socket.id);
    });
  });
}
