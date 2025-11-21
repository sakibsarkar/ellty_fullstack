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
exports.postController = exports.uploadPostImage = void 0;
const catchAsyncError_1 = require("../../../utils/catchAsyncError");
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const post_service_1 = __importDefault(require("./post.service"));
exports.uploadPostImage = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (!file) {
        return (0, sendResponse_1.default)(res, {
            message: "file not found",
            success: false,
            data: null,
            statusCode: 404,
        });
    }
    const url = file.path;
    if (!url) {
        return (0, sendResponse_1.default)(res, {
            message: "failed to upload image",
            success: false,
            data: null,
            statusCode: 400,
        });
    }
    (0, sendResponse_1.default)(res, {
        message: "image uploaded successfully",
        success: true,
        data: url,
        statusCode: 200,
    });
}));
const createPost = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { content, categories, images, premium, group } = req.body;
    const user = req.user._id;
    if (premium && !req.user.isPremium) {
        (0, sendResponse_1.default)(res, {
            success: false,
            data: null,
            message: "you need to subscribe to premium",
            statusCode: 400,
        });
        return;
    }
    const payload = {
        content,
        images,
        categories,
        premium: Boolean(premium),
        user: user,
        group,
    };
    const result = yield post_service_1.default.createPost(payload);
    (0, sendResponse_1.default)(res, {
        message: "post created successfully",
        success: true,
        data: result,
        statusCode: 200,
    });
}));
const getAllPosts = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const { result, totalDoc } = yield post_service_1.default.getAllPosts(query);
    (0, sendResponse_1.default)(res, {
        success: false,
        statusCode: 200,
        message: "No Data Found",
        data: result,
        totalDoc,
    });
}));
exports.postController = {
    createPost,
    uploadPostImage: exports.uploadPostImage,
    getAllPosts,
};
