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
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const post_model_1 = __importDefault(require("./post.model"));
const createPost = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.default.create(payload);
    return result;
});
const getAllPosts = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const model = post_model_1.default.find().populate("user");
    const queryModel = new QueryBuilder_1.default(model, query)
        .fields()
        .paginate()
        .sort()
        .filter()
        .search(["title", "content"]);
    const totalDoc = yield queryModel.count();
    const result = yield queryModel.modelQuery;
    return { result, totalDoc: totalDoc.totalCount };
});
const getPostById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.default.findById(id)
        .populate("user")
        .populate("categories");
    return result;
});
const postService = {
    createPost,
    getAllPosts,
    getPostById,
};
exports.default = postService;
