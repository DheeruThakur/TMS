import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { TeamList } from "../../models/Team";

interface ResponseObject {
  success: boolean;
  message: string;
  teamList?: TeamList[];
}

const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_SERVER_URL}/teams`,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).authState.accessToken;
    if (token) {
      headers.set("x-access-token", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithRetry = retry(baseQuery, { maxRetries: 2 });

export const teamsApi = createApi({
  reducerPath: "team",
  baseQuery: baseQueryWithRetry,
  endpoints: (build) => ({
    teamList: build.query<TeamList[], void>({
      query: () => `/all`,
      transformResponse: (response: ResponseObject) => {
        const responseData = response.teamList;
        return responseData!;
      },
    }),
  }),
});

export const { useTeamListQuery } = teamsApi;
