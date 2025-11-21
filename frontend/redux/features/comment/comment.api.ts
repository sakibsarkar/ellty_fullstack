import { api } from "redux/api/appSlice";
import type { IComment } from "types/comment";

const commentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCommentsByPostId: builder.query<
      { data: IComment[]; totalDoc: number },
      { postId: string; page: number }
    >({
      query: ({ postId, page }) => {
        return {
          url: `/comment/get/${postId}?page=${page}`,
          method: "GET",
        };
      },
      providesTags: ["comment"],
    }),
    getCommentRepliesByCommentId: builder.query<{ data: IComment[] }, string>({
      query: (commentId) => {
        return {
          url: `/comment/get/replies/${commentId}`,
          method: "GET",
        };
      },
      providesTags: ["comment"],
    }),
    createComment: builder.mutation<
      { data: IComment[] },
      { postId: string; comment: string; parentComment?: string }
    >({
      query: ({ postId, comment,parentComment }) => {
        return {
          url: `/comment/create/${postId}`,
          method: "POST",
          body: { comment, parentComment },
        };
      },
      invalidatesTags: ["comment"],
    }),
    deteComment: builder.mutation<{ data: IComment }, string>({
      query: (commentId) => {
        return {
          url: `/comment/delete/${commentId}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["comment"],
    }),
    updateComment: builder.mutation<
      { data: IComment },
      { commentId: string; comment: string }
    >({
      query: ({ commentId, comment }) => {
        return {
          url: `/comment/update/${commentId}`,
          method: "PUT",
          body: { comment },
        };
      },
      invalidatesTags: ["comment"],
    }),
  }),
});
export const {
  useGetCommentsByPostIdQuery,
  useCreateCommentMutation,
  useDeteCommentMutation,
  useUpdateCommentMutation,
  useGetCommentRepliesByCommentIdQuery,
  useLazyGetCommentRepliesByCommentIdQuery,
} = commentApi;
