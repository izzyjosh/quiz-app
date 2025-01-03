"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var catchAsync = function (controller) {
    return function (req, res, next) {
        try {
            controller(req, res, next);
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(error === null || error === void 0 ? void 0 : error.message);
            }
            return next(error);
        }
    };
};
exports.default = catchAsync;
