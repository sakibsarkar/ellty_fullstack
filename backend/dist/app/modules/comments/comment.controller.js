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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentController = void 0;
const catchAsyncError_1 = require("../../../utils/catchAsyncError");
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const comment_service_1 = require("./comment.service");
const createComment = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { comment, parentComment } = req.body;
    const post = req.params.id;
    const user = req.user;
    const payload = {
        post,
        comment,
        user: user._id,
        parentComment: parentComment || undefined,
    };
    const result = yield comment_service_1.commentService.createComment(payload);
    (0, sendResponse_1.default)(res, {
        message: "comment created successfully",
        success: true,
        data: result,
        statusCode: 200,
    });
}));
const getCommentsByPostId = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.id;
    const { result, totalDoc } = yield comment_service_1.commentService.getCommentsByPostId(postId, req.query);
    (0, sendResponse_1.default)(res, {
        message: "comments retrieved successfully",
        success: true,
        data: result,
        statusCode: 200,
        totalDoc,
    });
}));
const getCommentRepliesByCommentId = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = req.params.commentId;
    const result = yield comment_service_1.commentService.getCommentRepliesByCommentId(commentId);
    (0, sendResponse_1.default)(res, {
        message: "comments retrieved successfully",
        success: true,
        data: result,
        statusCode: 200,
    });
}));
const updateComment = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { comment } = req.body;
    const user = req.user;
    const result = yield comment_service_1.commentService.updateComment(id, user._id, comment);
    (0, sendResponse_1.default)(res, {
        message: "comment updated successfully",
        success: true,
        data: result,
        statusCode: 200,
    });
}));
const deleteComment = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = req.user;
    const result = yield comment_service_1.commentService.deleteComment(id, user._id);
    (0, sendResponse_1.default)(res, {
        message: "comment deleted successfully",
        success: true,
        data: result,
        statusCode: 200,
    });
}));
exports.commentController = {
    createComment,
    getCommentsByPostId,
    updateComment,
    deleteComment,
    getCommentRepliesByCommentId,
};
