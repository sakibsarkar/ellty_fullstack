import { catchAsyncError } from "../../../utils/catchAsyncError";
import sendResponse from "../../../utils/sendResponse";
import reactionService from "./reaction.service";

const changeReactionByPostId = catchAsyncError(async (req, res) => {
  const user = req.user;
  const { postId, reactionId } = req.body;
  const result = await reactionService.changeReactionByPostIdService(
    user._id,
    postId,
    reactionId
  );
  sendResponse(res, {
    data: result,
    success: true,
    message: "reaction changed successfully",
  });
});

const reactionController = {
  changeReactionByPostId,
};
export default reactionController;
