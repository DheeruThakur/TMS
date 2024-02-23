import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import {
  PositionAddData,
  PositionDetailsResponse,
  PositionGetApiData,
  PositionGetApiResponse,
  PositionObject,
  PositionPostData,
  PositionPostResponse,
  ReturnObject,
} from "../../models/Position";

interface Pagination {
  page: number;
  rowsPerPage: number;
  orderBy: string;
  order: "asc" | "desc";
  teamId?:string;
}

const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_SERVER_URL}/position`,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).authState.accessToken;
    if (token) {
      headers.set("x-access-token", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithRetry = retry(baseQuery, { maxRetries: 2 });

export const positionApi = createApi({
  reducerPath: "position",
  tagTypes: ["Position"],
  baseQuery: baseQueryWithRetry,
  endpoints: (build) => ({
    positionList: build.query<PositionGetApiData, Pagination>({
      query: ({ page = 1, rowsPerPage = 1, orderBy = "name", order = "asc" }) =>
        `?page=${page}&perPage=${rowsPerPage}&orderby=${orderBy}&order=${order}`,
      transformResponse: (response: PositionGetApiResponse) => {
        return {
          positionList: response.positionList,
          totalPosition: response.totalPosition,
        };
      },
      providesTags: ["Position"],
    }),
    positionListByTeamId: build.query<PositionGetApiData, Pagination>({
      query: ({ page = 1, rowsPerPage = 1, orderBy = "name", order = "asc", teamId }) =>
        `team/${teamId}?page=${page}&perPage=${rowsPerPage}&orderby=${orderBy}&order=${order}`,
      transformResponse: (response: PositionGetApiResponse) => {
        return {
          positionList: response.positionList,
          totalPosition: response.totalPosition,
        };
      },
    }),
    addPosition: build.mutation<PositionObject, PositionPostData>({
      query(data) {
        return {
          url: "",
          method: "POST",
          body: data,
        };
      },
      transformResponse(baseQueryReturnValue: PositionPostResponse) {
        return baseQueryReturnValue.position;
      },
      invalidatesTags: ["Position"],
    }),
    getPosition: build.query<PositionDetailsResponse, string>({
      query: (id) => `/${id}`,
      // transformResponse: (response: PositionGetApiResponse) => {
      //   return {
      //     positionList: response.positionList,
      //     totalPosition: response.totalPosition,
      //   };
      // },
      // providesTags: ["Position"],
    }),
    deletePost: build.mutation<ReturnObject, string>({
      query(id) {
        return {
          url: "",
          method: "DELETE",
          body: {
            positionId: id,
          },
        };
      },
      invalidatesTags: ["Position"],
    }),
    updatePosition: build.mutation<ReturnObject, PositionAddData>({
      query(formData) {
        return {
          url: ``,
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["Position"],
    }),
  }),
});

export const {
  usePositionListQuery,
  useAddPositionMutation,
  useDeletePostMutation,
  useGetPositionQuery,
  useUpdatePositionMutation,
  usePositionListByTeamIdQuery
} = positionApi;
