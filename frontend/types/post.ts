import type { TUser } from "./user";

export interface IPost {
  _id: string;
  commentCount: number;
  user: TUser;
  content: string;
  createdAt: string;
  updatedAt: string;
}
