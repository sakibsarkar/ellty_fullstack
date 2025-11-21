import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import type { RootState } from "redux/store/store";
import { setState, setToken, setUser } from "../features/auth/auth.slice";

export const baseUrl =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const baseQuery = fetchBaseQuery({
  baseUrl: baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
  // credentials: 'include',
});

const baseQueryWithRefreshToken: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    try {
      const refreshToken = Cookies.get("refreshToken") || "";

      const res = await fetch(`${baseUrl}/auth/refreshToken`, {
        method: "POST",

        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
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
