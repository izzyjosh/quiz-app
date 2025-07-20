import { check } from "express-validator";

export const userValidator = [
  check("email").isEmail().withMessage("Invalid Email"),
  check("password").isLength({ min: 4 }).withMessage("Password is too short"),
  check("adminSecret").optional().isLength({ min: 10 }).withMessage("invalid admin secret")
];
