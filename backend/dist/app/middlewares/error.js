"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
const AppError_1 = __importDefault(require("../errors/AppError"));
const handleCastError_1 = __importDefault(require("../errors/handleCastError"));
const handleDuplicateError_1 = __importDefault(require("../errors/handleDuplicateError"));
const handleValidationError_1 = __importDefault(require("../errors/handleValidationError"));
const handleZodError_1 = __importDefault(require("../errors/handleZodError"));
const globalErrorHandler = (error, req, res, next) => {
    let message = "Something went wrong!";
    let statusCode = 500;
    let errorMessages = [
        {
            path: "",
            message: "Something went wrong",
        },
    ];
    if (error instanceof zod_1.ZodError) {
        const simpleErr = (0, handleZodError_1.default)(error);
        statusCode = simpleErr === null || simpleErr === void 0 ? void 0 : simpleErr.statusCode;
        message = simpleErr === null || simpleErr === void 0 ? void 0 : simpleErr.message;
        errorMessages = simpleErr === null || simpleErr === void 0 ? void 0 : simpleErr.errorSources;
    }
    else if (error instanceof mongoose_1.default.Error.ValidationError) {
        const simpleErr = (0, handleValidationError_1.default)(error);
        statusCode = simpleErr === null || simpleErr === void 0 ? void 0 : simpleErr.statusCode;
        message = simpleErr === null || simpleErr === void 0 ? void 0 : simpleErr.message;
        errorMessages = simpleErr === null || simpleErr === void 0 ? void 0 : simpleErr.errorSources;
    }
    else if (error instanceof mongoose_1.default.Error.CastError) {
        const simpleErr = (0, handleCastError_1.default)(error);
        statusCode = simpleErr === null || simpleErr === void 0 ? void 0 : simpleErr.statusCode;
        message = simpleErr === null || simpleErr === void 0 ? void 0 : simpleErr.message;
        errorMessages = simpleErr === null || simpleErr === void 0 ? void 0 : simpleErr.errorSources;
    }
    else if (error.code === 11000) {
        const simpleErr = (0, handleDuplicateError_1.default)(error);
        statusCode = simpleErr === null || simpleErr === void 0 ? void 0 : simpleErr.statusCode;
        message = simpleErr === null || simpleErr === void 0 ? void 0 : simpleErr.message;
        errorMessages = simpleErr === null || simpleErr === void 0 ? void 0 : simpleErr.errorSources;
    }
    else if (error instanceof AppError_1.default) {
        statusCode = error === null || error === void 0 ? void 0 : error.statusCode;
        message = error.message;
        errorMessages = [
            {
                path: "",
                message: error === null || error === void 0 ? void 0 : error.message,
            },
        ];
    }
    else if (error instanceof Error) {
        message = error.message;
        errorMessages = [
            {
                path: "",
                message: error === null || error === void 0 ? void 0 : error.message,
            },
        ];
    }
    return res.status(statusCode).json({
        success: false,
        message,
        errorMessages: errorMessages,
        stack: process.env.NODE_ENV === "development" ? error === null || error === void 0 ? void 0 : error.stack : undefined,
    });
};
exports.default = globalErrorHandler;
