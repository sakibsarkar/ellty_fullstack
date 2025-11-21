import { api } from "redux/api/appSlice";
import type { TRole, TUser } from "types/user";
import type { logout } from "./auth.slice";

const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Create blog post
    register: builder.mutation({
      query: (post) => ({
        url: "/auth/register",
        method: "POST",
        body: post,
      }),
      invalidatesTags: ["user"],
    }),
    loginUser: builder.mutation({
      query: (post: { userName: string; password: string }) => ({
        url: "/auth/login",
        method: "POST",
        body: post,
      }),
      invalidatesTags: ["user"],
    }),
    changeRole: builder.mutation({
      query: (post: { id: string; role: TRole }) => ({
        url: `/auth/update-role/${post.id}`,
        method: "PUT",
        body: { role: post.role },
      }),
      invalidatesTags: ["user"],
    }),
    resetPassword: builder.mutation({
      query: (payload: { oldPassword: string; password: string }) => ({
        url: "/auth/reset-password",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["user"],
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["user"],
    }),
    getAuthor: builder.query<{ data: TUser }, string>({
      query: (token) => {
        return {
          url: `/auth/auth-state`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
      providesTags: ["user"],
    }),
  }),
});
export const {
  useRegisterMutation,
  useLoginUserMutation,
  useGetAuthorQuery,
  useChangeRoleMutation,
  useResetPasswordMutation,
  useLogoutMutation
} = userApi;
