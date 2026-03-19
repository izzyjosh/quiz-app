import { io } from "../app";

/**
 * WebSocket event handlers for real-time quiz session updates
 * Clients join session rooms and receive live submission feedback
 */

io.on("connection", (socket) => {
  console.log("A client connected: " + socket.id);

  /**
   * joinSession - User joins a specific quiz session room
   * Event emitted from client when they start taking a quiz
   * All users in the same session will receive real-time updates
   */
  socket.on("joinSession", (sessionId) => {
    console.log(`Client ${socket.id} joining session: ${sessionId}`);
    socket.join(`session-${sessionId}`);

    // Notify other participants that a new user joined
    socket.to(`session-${sessionId}`).emit("participantJoined", {
      participantId: socket.id,
      timestamp: new Date(),
    });
  });

  /**
   * leaveSession - User leaves a quiz session room
   */
  socket.on("leaveSession", (sessionId) => {
    console.log(`Client ${socket.id} leaving session: ${sessionId}`);
    socket.leave(`session-${sessionId}`);
  });

  /**
   * submissionFeedback - Real-time feedback when a participant submits an answer
   * This event is emitted from the SubmissionService and broadcast to all room members
   * Contains: participantId, questionId, isCorrect, pointsEarned, updatedScore, etc.
   */
  socket.on("submissionFeedback", (data) => {
    console.log(`Submission feedback received for session: ${data.sessionId}`);
    console.log(data);
    // The service handles broadcasting this to all clients in the room
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected: " + socket.id);
  });
});
