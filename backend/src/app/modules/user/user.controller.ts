import { JwtPayload } from "jsonwebtoken";
import { catchAsyncError } from "../../../utils/catchAsyncError";
import sendResponse from "../../../utils/sendResponse";
import User from "./user.model";

export const updateUserProfileImage = catchAsyncError(async (req, res) => {
  const file = req.file;
  const user = req.user as JwtPayload;
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

  const isExistUser = await User.findOne({ email: user.email });
  if (!isExistUser) {
    return sendResponse(res, {
      message: "user not found",
      success: false,
      data: null,
      statusCode: 404,
    });
  }
  const result = await User.findByIdAndUpdate(
    isExistUser._id,
    { image: url },
    { new: true, runValidators: true }
  );

  sendResponse(res, {
    data: result,
    message: "image updated successfully",
    statusCode: 200,
    success: true,
  });
});
export const updateUserInfo = catchAsyncError(async (req, res) => {
  const { body } = req;
  const user = req.user as JwtPayload;
  ["userName", "role", "image"].forEach((item) => delete body[item]);

  const isExistUser = await User.findOne({ email: user.email });
  if (!isExistUser) {
    return sendResponse(res, {
      message: "user not found",
      success: false,
      data: null,
      statusCode: 404,
    });
  }

  const result = await User.findByIdAndUpdate(isExistUser._id, body, {
    new: true,
    runValidators: true,
  });

  sendResponse(res, {
    data: result,
    message: "user profile updated successfully",
    statusCode: 200,
    success: true,
  });
});
