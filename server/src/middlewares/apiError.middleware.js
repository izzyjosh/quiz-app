"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerErrorMiddleware = exports.NotFoundErrorMiddleware = void 0;
var http_status_codes_1 = require("http-status-codes");
var apiErrors_1 = require("../utils/apiErrors");
var NotFoundErrorMiddleware = function (req, res, next) {
    res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
        message: "Not found",
        status: http_status_codes_1.StatusCodes.NOT_FOUND
    });
};
exports.NotFoundErrorMiddleware = NotFoundErrorMiddleware;
var ServerErrorMiddleware = function (err, req, res, next) {
    res
        .status(err instanceof apiErrors_1.default
        ? err.statusCode
        : http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
        statusCode: err instanceof apiErrors_1.default
            ? err.statusCode
            : http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message,
        errors: err instanceof apiErrors_1.APIValidationError ? err.errors : []
    });
};
exports.ServerErrorMiddleware = ServerErrorMiddleware;
