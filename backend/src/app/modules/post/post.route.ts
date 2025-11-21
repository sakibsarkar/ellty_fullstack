import { Router } from "express";
import { multerUpload } from "../../config/cloudinaryMulter.config";
import { isAuthenticatedUser } from "../../middlewares/auth";
import { validSchema } from "../../middlewares/validator";
import { postController } from "./post.controller";
import { postValidationSchema } from "./post.validation";
const router = Router();
router.post(
  "/create",
  isAuthenticatedUser,
  validSchema(postValidationSchema),
  postController.createPost
);

router.delete(
  "/delete/:postId",
  isAuthenticatedUser,
  postController.deletePost
);
router.post(
  "/upload-image",
  isAuthenticatedUser,
  multerUpload.single("file"),
  postController.uploadPostImage
);
router.get("/get", isAuthenticatedUser, postController.getAllPosts);
router.get("/get/profile/:userId", isAuthenticatedUser, postController.getUserProfilePostByUserId);
router.get("/get/:id", isAuthenticatedUser, postController.getPostById);
const postRoute = router;

export default postRoute;
