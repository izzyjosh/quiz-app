import { check } from "express-validator";

export const userValidator = [
	check("email").isEmail().withMessage("Invalid Email"),
	check("password").isLength({ min: 4 }).withMessage("Password is too short"),
];

