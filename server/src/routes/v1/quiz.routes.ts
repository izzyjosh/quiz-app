import { Router } from "express";
import QuizController from "../../controller/quiz.controller";
import { updateQuizValidator, quizValidator } from "../../utils/validators";
import catchAsync from "../../utils/catchAsync";

const quizRouter = Router();
quizRouter.post("/", quizValidator, catchAsync(QuizController.create));
quizRouter.get("/", catchAsync(QuizController.all));
quizRouter.get("/:id", catchAsync(QuizController.fetchOne));
quizRouter.put("/:id", updateQuizValidator, catchAsync(QuizController.update));
quizRouter.delete("/:id", catchAsync(QuizController.deleteQuiz));

export default quizRouter;
