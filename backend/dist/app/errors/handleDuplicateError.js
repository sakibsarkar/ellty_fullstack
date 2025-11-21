"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleDuplicateError = (err) => {
    const errorSources = [
        {
            path: "",
            message: err.message,
        },
    ];
    const statusCode = 409;
    return {
        statusCode,
        message: "Duplicate Entry",
        errorSources,
    };
};
exports.default = handleDuplicateError;
