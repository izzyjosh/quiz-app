import { Router } from "express";
import CategoryController from "../../controller/category.controller";
import { categoryValidator } from "../../utils/validators";
import catchAsync from "../../utils/catchAsync";

const categoryRouter = Router();

categoryRouter.get("/", catchAsync(CategoryController.all));
categoryRouter.get("/:id", catchAsync(CategoryController.findOne));
categoryRouter.post(
  "/",
  categoryValidator,
  catchAsync(CategoryController.create)
);
categoryRoute.delete("/:id", catchAsync(CategoryController.deleteCategory));

export default categoryRouter
