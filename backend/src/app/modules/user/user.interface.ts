export type TUser = {
  _id: string;
  userName: string;
  firstName: string;
  lastName: string;
  role: "user" | "admin";
  createdAt: string;
  isPremium: boolean;
  image?: string;
};
