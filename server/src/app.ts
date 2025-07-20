import express, { Express } from "express";
import { config } from "dotenv";
import logger from "morgan";
import "reflect-metadata";
import AppDataSource from "./datasource/datasource";
import authRouter from "./routes/v1/user.routes";
import {
  NotFoundErrorMiddleware,
  ServerErrorMiddleware
} from "./middlewares/apiError.middleware";

config();

const app: Express = express();

app.set("port", process.env.PORT || 3000);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger("dev"));

app.use("/api/v1/auth", authRouter);

app.use(NotFoundErrorMiddleware);
app.use(ServerErrorMiddleware);

(async () => {
  try {
    
    await AppDataSource.initialize();
    app.listen(3000, () => {
      console.log(`Server listening on port ${app.get("port")}`);
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("An unexpected error occurred");
    }
  }
})();
