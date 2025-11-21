import { api } from "redux/api/appSlice";
import { type IPost } from "types/post";

const postApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllPost: builder.query<
      { data: IPost[]; totalDoc: number },
      Record<string, any>
    >({
      query: (payload) => {
        const query = Object.keys(payload)
          .map((key) => `${key}=${payload[key]}`)
          .join("&");
        return {
          url: `/post/get?${query}`,
          method: "GET",
          keepUnusedDataFor: 0,
        };
      },
      providesTags: ["post"],
    }),

    cratePost: builder.mutation<{ data: IPost }, Pick<IPost, "content">>({
      query: (payload) => {
        return {
          url: `/post/create`,
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: ["post"],
    }),
  }),
});
export const { useGetAllPostQuery, useCratePostMutation } = postApi;
