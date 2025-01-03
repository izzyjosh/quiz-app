"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_validator_1 = require("express-validator");
var parseValidationError = function (req) {
    var result = (0, express_validator_1.validationResult)(req);
    var errors = result.array();
    var parsedErrors = errors.map(function (_a) {
        var message = _a.msg, field = _a.path;
        return {
            field: field,
            message: message
        };
    });
    return parsedErrors;
};
exports.default = parseValidationError;
