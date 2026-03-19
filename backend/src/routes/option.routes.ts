import { Router } from "express";
import { optionController } from "../controllers/option.controllers";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validateRequest } from "../utils/request-validation";
import { createOptionSchema } from "../schemas/option.schemas";

export const optionRouter = Router({ mergeParams: true });

optionRouter.post(
  "/options",
  authMiddleware,
  validateRequest(createOptionSchema),
  (req, res, next) => {
    optionController.createOption(req, res, next);
  },
);

optionRouter.get("/options", authMiddleware, (req, res, next) => {
  optionController.getOptions(req, res, next);
});
