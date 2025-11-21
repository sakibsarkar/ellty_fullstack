export type TRole = "user" | "admin";

export type TUser = {
  _id: string;
  userName: string;
  firstName: string;
  lastName: string;
  role: "user" | "admin";
  createdAt: string;
  image?: string;
  auth?: {
    role: TRole;
    _id: string;
  };
};

export type TProfileData = Omit<TUser, "role" | "auth"> & {
  isFollowing: boolean;
  totalPost: number;
  totalFollower: number;
};
