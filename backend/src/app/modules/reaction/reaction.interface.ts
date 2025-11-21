export type TReactionType = "like" | "love" | "haha" | "wow" | "sad" | "angry";

export interface IReaction {
  reactionId: TReactionType;
  post: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}
