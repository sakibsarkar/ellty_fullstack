export interface IPost {
  content: string;
  images: string[];
  categories: string;
  premium: boolean;
  user: string;
  group?: string;
  upvoteCount: number;
  downvoteCount: number;
  commentCount: number;
}
