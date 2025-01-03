"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var user_controller_1 = require("../../controller/user.controller");
var validators_1 = require("../../utils/validators");
var authRouter = (0, express_1.Router)();
authRouter.post("", validators_1.userValidator, user_controller_1.createUser);
exports.default = authRouter;
