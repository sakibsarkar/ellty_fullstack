"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postValidationSchema = void 0;
const zod_1 = require("zod");
// Define the Zod schema for the post
exports.postValidationSchema = zod_1.z.object({
    content: zod_1.z.string().min(1, "Content is required"),
    images: zod_1.z.array(zod_1.z.string().url("Each image must be a valid URL")).optional(),
});
