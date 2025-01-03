"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_status_codes_1 = require("http-status-codes");
var successResponse = function (_a) {
    var res = _a.res, _b = _a.message, message = _b === void 0 ? "success" : _b, _c = _a.data, data = _c === void 0 ? {} : _c, _d = _a.statusCode, statusCode = _d === void 0 ? http_status_codes_1.StatusCodes.OK : _d;
    return res.status(statusCode).json({
        statusCode: statusCode,
        message: message,
        data: data
    });
};
exports.default = successResponse;
