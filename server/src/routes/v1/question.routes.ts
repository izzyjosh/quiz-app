import { Router } from "express";
import QuestionController from "../../controller/question.controller";
import {
  updateQuestionValidator,
  questionValidator
} from "../../utils/validators";
import catchAsync from "../../utils/catchAsync";

const questionRouter = Router();
questionRouter.get("/:quizId/questions", catchAsync(QuestionController.all));
questionRouter.post(
  "/",
  questionValidator,
  catchAsync(QuestionController.create)
);
questionRouter.get("/:id", catchAsync(QuestionController.findOne));
questionRouter.delete("/:id", catchAsync(QuestionController.deleteQuestion));
questionRouter.put(
  "/:id",
  updateQuestionValidator,
  catchAsync(QuestionController.update)
);

export default questionRouter;
