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

    

    socket.on("disconnect", () => {
      console.log("Client disconnected: " + socket.id);
    });
  });
}
