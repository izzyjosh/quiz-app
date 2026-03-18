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
import { AppDataSource } from "./config/datasource";

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

// Middlewares

app.use(NotFoundErrorHandler);
app.use(RequestErrorHandler);

console.log("Starting server...");

// Start server using IIFE
(async () => {
  try {
    await AppDataSource.initialize();
    sysLogger.info("Database connected successfully");

    app.listen(app.get("port"), () => {
      sysLogger.info(`Server is running on port ${app.get("port")}`);
    });
  } catch (e) {
    sysLogger.error(`An error occurred while starting the server: ${e}`);
  }
})();
