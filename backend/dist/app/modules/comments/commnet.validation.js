"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentValidationSchema = void 0;
const zod_1 = require("zod");
exports.CommentValidationSchema = zod_1.z.object({
    comment: zod_1.z.string(),
    post: zod_1.z.string(),
    user: zod_1.z.string(),
});
