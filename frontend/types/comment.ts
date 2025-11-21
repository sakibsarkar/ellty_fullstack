import type { IPost } from "./post";
import type { TUser } from "./user";

export interface IComment {
  _id: string;
  comment: string;
  post: IPost;
  user: TUser;
  createdAt: string;
}
