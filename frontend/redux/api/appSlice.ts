import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { setState, setToken, setUser } from "../features/auth/auth.slice";

export const baseUrl =
  import.meta.env.VITE_API_URL || "https://elltybookbackend.vercel.app/api/v1";

const baseQuery = fetchBaseQuery({
  baseUrl: baseUrl,

  credentials: "include",
});

const baseQueryWithRefreshToken: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    try {
      const res = await fetch(`${baseUrl}/auth/refreshToken`, {
        method: "POST",
      });

      if (!res.ok) {
        api.dispatch(setState({ isLoading: false, token: null, user: null }));
        result = await baseQuery(args, api, extraOptions);
        return result;
      }

      const data = await res.json();
      const token = data?.data?.accessToken || "";
      const user = data?.data;

      if (token) {
        api.dispatch(setUser({ user }));
        api.dispatch(setToken(token));
        result = await baseQuery(args, api, extraOptions);
      }
    } catch (error) {
      api.dispatch(setState({ isLoading: false, token: null, user: null }));
    }
  }
  return result;
};

export const api = createApi({
  reducerPath: "api",

  baseQuery: baseQueryWithRefreshToken,
  tagTypes: [
    "user",
    "post",
    "category",
    "comment",
    "follower",
    "statistics",
    "reaction",
    "group",
  ],
  endpoints: () => ({}),
});
