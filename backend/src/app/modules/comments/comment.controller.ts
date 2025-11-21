import { JwtPayload } from "jsonwebtoken";
import { catchAsyncError } from "../../../utils/catchAsyncError";
import sendResponse from "../../../utils/sendResponse";
import { commentService } from "./comment.service";

const createComment = catchAsyncError(async (req, res) => {
  const { comment, parentComment } = req.body;
  const post = req.params.id;
  const user = req.user as JwtPayload;
  const payload = {
    post,
    comment,
    user: user._id,
    parentComment: parentComment || undefined,
  };
  const result = await commentService.createComment(payload);
  sendResponse(res, {
    message: "comment created successfully",
    success: true,
    data: result,
    statusCode: 200,
  });
});

const getCommentsByPostId = catchAsyncError(async (req, res) => {
  const postId = req.params.id;
  const { result, totalDoc } = await commentService.getCommentsByPostId(
    postId,
    req.query
  );
  sendResponse(res, {
    message: "comments retrieved successfully",
    success: true,
    data: result,
    statusCode: 200,
    totalDoc,
  });
});
const getCommentRepliesByCommentId = catchAsyncError(async (req, res) => {
  const commentId = req.params.commentId;
  const result = await commentService.getCommentRepliesByCommentId(commentId);
  sendResponse(res, {
    message: "comments retrieved successfully",
    success: true,
    data: result,
    statusCode: 200,
  });
});

const updateComment = catchAsyncError(async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;
  const user = req.user as JwtPayload;
  const result = await commentService.updateComment(id, user._id, comment);
  sendResponse(res, {
    message: "comment updated successfully",
    success: true,
    data: result,
    statusCode: 200,
  });
});

const deleteComment = catchAsyncError(async (req, res) => {
  const { id } = req.params;
  const user = req.user as JwtPayload;
  const result = await commentService.deleteComment(id, user._id);
  sendResponse(res, {
    message: "comment deleted successfully",
    success: true,
    data: result,
    statusCode: 200,
  });
});

export const commentController = {
  createComment,
  getCommentsByPostId,
  updateComment,
  deleteComment,
  getCommentRepliesByCommentId,
};
