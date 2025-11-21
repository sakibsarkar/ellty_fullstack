import express from "express";
import authRoute from "../modules/auth/auth.route";

import commentRoute from "../modules/comments/comment.route";
import postRoute from "../modules/post/post.route";
import reactionRoute from "../modules/reaction/raction.route";
import userRoute from "../modules/user/user.route";

// import userRoutes from "../modules/user/user.route";
const router = express.Router();

const moduleRoute = [
  {
    path: "/auth",
    route: authRoute,
  },

  {
    path: "/user",
    route: userRoute,
  },
  {
    path: "/post",
    route: postRoute,
  },

  {
    path: "/reaction",
    route: reactionRoute,
  },

  {
    path: "/comment",
    route: commentRoute,
  },
];

moduleRoute.forEach((route) => router.use(route.path, route.route));

export default router;
