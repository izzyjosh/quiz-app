import { check } from "express-validator";

export const userValidator = [
  check("email").isEmail().withMessage("Invalid Email"),
  check("password").isLength({ min: 4 }).withMessage("Password is too short"),
  check("adminSecret")
    .optional()
    .isLength({ min: 10 })
    .withMessage("invalid admin secret")
];

export const quizValidator = [
  check("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters long"),

  check("description")
    .optional()
    .isLength({ max: 255 })
    .withMessage("Description must be at most 255 characters"),

  check("numberOfQuestions")
    .notEmpty()
    .withMessage("Number of questions is required")
    .isInt({ min: 1 })
    .withMessage("Number of questions must be at least 1"),

  check("timelimit")
    .notEmpty()
    .withMessage("Time limit is required")
    .matches(/^\d+[smhd]$/)
    .withMessage(
      "Timelimit must be in the format like '5m', '2h', '30s' (s/m/h/d)"
    ),

  check("categoryId")
    .notEmpty()
    .withMessage("Category ID is required")
    .isUUID()
    .withMessage("Category ID must be a valid UUID"),

  check("questions")
    .optional()
    .isArray()
    .withMessage("Questions must be an array")
];

export const updateQuizValidator = [
  check("title").optional().isString().withMessage("Title must be a string"),

  check("description")
    .optional()
    .isLength({ max: 255 })
    .withMessage("Description must be at most 255 characters")
    .isString()
    .withMessage("Description must be a string"),

  check("numberOfQuestions")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Number of questions must be a positive integer"),

  check("timelimit")
    .optional()
    .matches(/^\d+[smhd]$/)
    .withMessage(
      "Timelimit must be in the format like '5m', '2h', '30s' (s/m/h/d)"
    ),

  check("categoryId")
    .optional()
    .isUUID()
    .withMessage("Category ID must be a valid UUID")
];

export const categoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("This field is required")
    .isString()
    .withMessage("must be a string"),

  check("description")
    .optional()
    .isLength({ max: 255 })
    .withMessage("must be less than 255 characters")
];

export const questionValidator = [
  check("question")
    .notEmpty()
    .withMessage("this field is required")
    .isString()
    .withMessage("must be a strikg"),
  check("options")
    .isArray({ min: 1 })
    .withMessage("Options must be a non-empty array")
    .custom(value => {
      if (!value.every((v: any) => typeof v === "string")) {
        throw new Error("Each option must be a string");
      }
      return true;
    }),
  check("answer")
    .notEmpty()
    .withMessage("this field is required")
    .isString()
    .withMessage("must be a string"),
  check("quizId")
    .notEmpty()
    .withMessage("field is required")
    .isString()
    .withMessage("must be a valid string")
];
export const updateQuestionValidator = [
  check("question").optional().isString().withMessage("must be a strikg"),
  check("options")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Options must be a non-empty array")
    .custom(value => {
      if (!value.every((v: any) => typeof v === "string")) {
        throw new Error("Each option must be a string");
      }
      return true;
    }),
  check("answer").optional().isString().withMessage("must be a string")
];
