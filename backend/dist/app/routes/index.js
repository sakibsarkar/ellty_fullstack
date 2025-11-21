"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = __importDefault(require("../modules/auth/auth.route"));
const comment_route_1 = __importDefault(require("../modules/comments/comment.route"));
const post_route_1 = __importDefault(require("../modules/post/post.route"));
const user_route_1 = __importDefault(require("../modules/user/user.route"));
// import userRoutes from "../modules/user/user.route";
const router = express_1.default.Router();
const moduleRoute = [
    {
        path: "/auth",
        route: auth_route_1.default,
    },
    {
        path: "/user",
        route: user_route_1.default,
    },
    {
        path: "/post",
        route: post_route_1.default,
    },
    {
        path: "/comment",
        route: comment_route_1.default,
    },
];
moduleRoute.forEach((route) => router.use(route.path, route.route));
exports.default = router;
