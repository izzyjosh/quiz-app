"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidator = void 0;
var express_validator_1 = require("express-validator");
exports.userValidator = [
    (0, express_validator_1.check)("email").isEmail().withMessage("Invalid Email"),
    (0, express_validator_1.check)("password").isLength({ min: 4 }).withMessage("Password is too short")
];
