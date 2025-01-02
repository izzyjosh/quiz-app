import express, { Express } from "express";
import { config } from "dotenv";
import logger from "morgan";
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
app.use(NotFoundErrorMiddleware)
app.use(ServerErrorMiddleware)

app.listen(3000, () => {
  console.log(`Server listening at port: ${app.get("port")}`);
});
