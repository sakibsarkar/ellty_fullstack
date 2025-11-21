import { Router } from "express";
import { isAuthenticatedUser } from "../../middlewares/auth";
import { validSchema } from "../../middlewares/validator";
import reactionController from "./reaction.controller";
import reactionValidation from "./reaction.validation";
const router = Router();
router.patch(
  "/change",
  validSchema(reactionValidation.change),
  isAuthenticatedUser,
  reactionController.changeReactionByPostId
);

const reactionRoute = router;
export default reactionRoute;