import type { IPost } from "./post";
import type { TUser } from "./user";

export interface IComment {
  _id: string;
  comment: string;
  post?: IPost;
  replyCount: number;
  parentComment?: string;
  user: TUser;
  createdAt: string;
}
