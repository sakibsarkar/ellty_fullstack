import QueryBuilder from "../../builder/QueryBuilder";
import { IAnyObject } from "../../interface/error";
import { IPost } from "./post.interface";
import Post from "./post.model";

const createPost = async (payload: IPost) => {
  const result = await Post.create(payload);
  return result;
};

const getAllPosts = async (query: IAnyObject) => {
  const model = Post.find().populate("user");

  const queryModel = new QueryBuilder(model, query)
    .fields()
    .paginate()
    .sort()
    .filter()
    .search(["title", "content"]);

  const totalDoc = await queryModel.count();
  const result = await queryModel.modelQuery;

  return { result, totalDoc: totalDoc.totalCount };
};

const getPostById = async (id: string) => {
  const result = await Post.findById(id)
    .populate("user")
    .populate("categories");
  return result;
};

const postService = {
  createPost,
  getAllPosts,
  getPostById,
};
export default postService;
