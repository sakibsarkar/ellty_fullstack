/* eslint-disable @typescript-eslint/ban-ts-comment */
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { IAnyObject } from "../../interface/error";
import Reaction from "../reaction/reaction.model";
import { TUser } from "../user/user.interface";
import { IPost } from "./post.interface";
import Post from "./post.model";

const createPost = async (payload: IPost) => {
  const result = await Post.create(payload);
  return result;
};

const getAllPosts = async (query: IAnyObject, user: TUser) => {
  const model = Post.find().populate("user");

  const queryModel = new QueryBuilder(model, query)
    .fields()
    .paginate()
    .sort()
    .filter()
    .search(["title", "content"]);

  const totalDoc = await queryModel.count();
  const result = await queryModel.modelQuery;

  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const postObjs: any[] = result.map((result) => result.toObject());

  for (let i = 0; i < postObjs.length; i++) {
    const post = postObjs[i];
    const reacted = await Reaction.findOne({
      // @ts-ignore
      post: post._id as string,
      user: user?._id,
    });

    postObjs[i] = {
      ...post,
      reacted,
    };
  }

  return { result: postObjs, totalDoc: totalDoc.totalCount };
};

const getUserProfilePostByUserId = async (
  query: IAnyObject,
  userId: string
) => {
  const model = Post.find({ user: userId, group: { $exists: false } })
    .populate("user")
    .populate("categories");
  const queryModel = new QueryBuilder(model, query)
    .fields()
    .paginate()
    .sort()
    .filter()
    .search(["title", "content"]);

  const totalDoc = await queryModel.count();
  const result = await queryModel.modelQuery;

  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const postObjs: any[] = result.map((result) => result.toObject());

  for (let i = 0; i < postObjs.length; i++) {
    const post = postObjs[i];
    const reacted = await Reaction.findOne({
      // @ts-ignore
      post: post._id as string,
      user: userId,
    });

    postObjs[i] = {
      ...post,
      reacted,
    };
  }

  return { result: postObjs, totalDoc: totalDoc.totalCount };
};

const getPostById = async (id: string) => {
  const result = await Post.findById(id)
    .populate("user")
    .populate("categories");
  return result;
};

const updatePost = async (id: string, payload: IPost, user: string) => {
  const isExists = await Post.findById(id).populate("group");
  if (!isExists) {
    throw new AppError(404, "Post not found");
  }

  if (isExists.user.toString() !== user.toString()) {
    throw new AppError(403, "Unauthorized access");
  }

  const updatePayload: Partial<IPost> = {};

  ["content", "images", "categories"].forEach((key) => {
    // @ts-ignore
    if (payload[key]) {
      // @ts-ignore
      updatePayload[key] = payload[key];
    }
  });

  const result = await Post.findByIdAndUpdate(id, updatePayload, { new: true });
  return result;
};

const deletePost = async (id: string, user: TUser) => {
  const isExists = await Post.findById(id);
  if (!isExists) {
    throw new AppError(404, "Post not found");
  }

  if (
    isExists.user.toString() !== user._id.toString() &&
    user.role !== "admin"
  ) {
    ``;
    throw new AppError(403, "Unauthorized access");
  }

  const result = await Post.findByIdAndDelete(isExists._id);
  return result;
};
const postService = {
  createPost,
  deletePost,
  getAllPosts,
  getUserProfilePostByUserId,
  getPostById,
  updatePost,
};
export default postService;
