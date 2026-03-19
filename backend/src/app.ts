import express, { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { SuccessResponse } from "./utils/responses";
import sysLogger from "./utils/logger";
import { config } from "./config/config";
import {
  NotFoundErrorHandler,
  RequestErrorHandler,
} from "./middlewares/errors.handler";
import cors from "cors";
import rateLimit from "express-rate-limit";
import compression from "compression";
import logger from "morgan";
import helmet from "helmet";
import http from "http";
import { Server } from "socket.io";
import { AppDataSource } from "./config/datasource";
import { authRouter } from "./routes/auth.routes";
import { quizRouter } from "./routes/quiz.routes";
import { questionRouter } from "./routes/question.routes";
import { optionRouter } from "./routes/option.routes";
import { sesssionRouter } from "./routes/quizsession.routes";
import { submissionRouter } from "./routes/submission.routes";
import { autoActivateSessions } from "./utils/session-scheduler";
import "./utils/socket"; // Load WebSocket event handlers

const app = express();

const corsOrigin = ["http://localhost:3000", "https://localhost:3000"];

app.use(
  cors({
    origin: corsOrigin,
  }),
);

// Rate limiter
const rateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 200,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

app.use(rateLimiter);
app.use(helmet());
app.use(logger("combined"));
app.set("port", config.port);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

app.get("/", (req: Request, res: Response) => {
  const response = SuccessResponse({
    status: "success",
    message: "Welcome to IZZY quiz lab API",
    data: null,
  });

  res.status(StatusCodes.OK).json(response);
});

app.use("/api/auth", authRouter);
app.use("/api/quizzes", quizRouter);
app.use("/api/quizzes/:quizId", questionRouter);
app.use("/api/quizzes/:quizId/questions/:questionId", optionRouter);
app.use("/api/sessions", sesssionRouter);
app.use("/api/submissions", submissionRouter);

// Middlewares

app.use(NotFoundErrorHandler);
app.use(RequestErrorHandler);

const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Start server using IIFE
(async () => {
  try {
    await AppDataSource.initialize();
    sysLogger.info("Database connected successfully");

    server.listen(app.get("port"), () => {
      sysLogger.info(`Server + socket is running on port ${app.get("port")}`);
    });

    // Start session auto-activation scheduler (runs every minute)
    setInterval(autoActivateSessions, 60 * 1000);
    sysLogger.info("Session auto-activation scheduler started");
  } catch (e) {
    sysLogger.error(`An error occurred while starting the server: ${e}`);
  }
})();
