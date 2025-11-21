import { Router } from "express";
import { multerUpload } from "../../config/cloudinaryMulter.config";
import { isAuthenticatedUser } from "../../middlewares/auth";
import { updateUserInfo, updateUserProfileImage } from "./user.controller";

const router = Router();
router.put("/update", isAuthenticatedUser, updateUserInfo);

router.put(
  "/update-profile-image",
  isAuthenticatedUser,
  multerUpload.single("file"),
  updateUserProfileImage
);
const userRoute = router;
export default userRoute;
