"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var datasource_1 = require("../datasource/datasource");
var jwt = require("jsonwebtoken");
var User_1 = require("../entity/User");
var apiErrors_1 = require("../utils/apiErrors");
require("dotenv/config");
var bcrypt = require("bcryptjs");
var secretKey = process.env.JWTSECRET || "defaultwebtoken";
var expirationTime = process.env.EXPIRATIONTIME;
var UserService = /** @class */ (function () {
    function UserService() {
        this.userRepository = datasource_1.default.getRepository(User_1.User);
    }
    UserService.prototype.createUser = function (email, password) {
        return __awaiter(this, void 0, Promise, function () {
            var existingUser, user, savedUser, payload, token, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepository.findOneBy({ email: email })];
                    case 1:
                        existingUser = _a.sent();
                        if (existingUser) {
                            throw new apiErrors_1.default("User with this email already exist", 404);
                        }
                        user = new User_1.User();
                        user.email = email;
                        user.password = password;
                        return [4 /*yield*/, this.userRepository.save(user)];
                    case 2:
                        savedUser = _a.sent();
                        payload = { email: savedUser.email, id: savedUser.id };
                        token = jwt.sign(payload, secretKey, { expiresIn: expirationTime });
                        response = {
                            accessToken: token,
                            email: savedUser.email,
                            id: savedUser.id
                        };
                        return [2 /*return*/, response];
                }
            });
        });
    };
    UserService.prototype.loginUser = function (email, password) {
        return __awaiter(this, void 0, Promise, function () {
            var currentUser, isCorrectPassword, payload, token, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepository.findOneBy({ email: email })];
                    case 1:
                        currentUser = _a.sent();
                        if (!currentUser) {
                            throw new apiErrors_1.default("Invalid credentials", 400);
                        }
                        isCorrectPassword = bcrypt.compare(password, currentUser.password);
                        if (!isCorrectPassword) {
                            throw new apiErrors_1.default("Invalid credentials", 400);
                        }
                        payload = { email: currentUser.email, id: currentUser.id };
                        token = jwt.sign(payload, secretKey, { expiresIn: expirationTime });
                        response = {
                            accessToken: token,
                            email: currentUser.email,
                            id: currentUser.id
                        };
                        return [2 /*return*/, response];
                }
            });
        });
    };
    return UserService;
}());
var userService = new UserService();
exports.default = userService;
