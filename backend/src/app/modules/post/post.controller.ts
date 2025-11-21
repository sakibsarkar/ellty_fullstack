import { catchAsyncError } from "../../../utils/catchAsyncError";
import sendResponse from "../../../utils/sendResponse";
import { IPost } from "./post.interface";
import postService from "./post.service";

export const uploadPostImage = catchAsyncError(async (req, res) => {
  const file = req.file;
  if (!file) {
    return sendResponse(res, {
      message: "file not found",
      success: false,
      data: null,
      statusCode: 404,
    });
  }
  const url = file.path as string;
  if (!url) {
    return sendResponse(res, {
      message: "failed to upload image",
      success: false,
      data: null,
      statusCode: 400,
    });
  }

  sendResponse(res, {
    message: "image uploaded successfully",
    success: true,
    data: url,
    statusCode: 200,
  });
});

const createPost = catchAsyncError(async (req, res) => {
  const { content, categories, images, premium, group } = req.body;
  const user = req.user._id;

  if (premium && !req.user.isPremium) {
    sendResponse(res, {
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
    user: user as string,
    group,
  } as IPost;
  const result = await postService.createPost(payload);

  sendResponse(res, {
    message: "post created successfully",
    success: true,
    data: result,
    statusCode: 200,
  });
});

const getAllPosts = catchAsyncError(async (req, res) => {
  const query = req.query;
  const { result, totalDoc } = await postService.getAllPosts(query);

  sendResponse(res, {
    success: false,
    statusCode: 200,
    message: "No Data Found",
    data: result,
    totalDoc,
  });
});

export const postController = {
  createPost,
  uploadPostImage,
  getAllPosts,
};
