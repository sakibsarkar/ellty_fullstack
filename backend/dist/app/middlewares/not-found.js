"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = void 0;
const notFound = (req, res) => {
    res.status(404).json({
        success: false,
        statusCode: 404,
        message: "rote not not Found",
        origin: {
            path: req.originalUrl,
            method: req.method,
        },
    });
};
exports.notFound = notFound;
