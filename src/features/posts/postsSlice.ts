import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { sub } from "date-fns";
import { IPostType } from "../../types/post";
import { apiSlice } from "../api/apiSlice";

export const postsAdapter = createEntityAdapter<IPostType>({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});
const initialState = postsAdapter.getInitialState();
const initialReactions = {
  thumbsUp: 0,
  wow: 0,
  heart: 0,
  rocket: 0,
  coffee: 0,
};

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => "/posts",
      transformResponse: (responseData: IPostType[]) => {
        let min = 1;
        const loadedPosts = responseData.map((post) => {
          if (!post.date)
            post.date = sub(new Date(), { minutes: min++ }).toISOString();
          if (!post.reactions) post.reactions = initialReactions;
          return post;
        });
        //**
        //*for getting the entity object
        //*similar to postsAdapter.upserMany() */
        return postsAdapter.setAll(initialState, loadedPosts);
      },
      providesTags: (result) =>
        result?.ids
          ? [
              ...result.ids.map((id) => ({ type: "Posts" as const, id })),
              { type: "Posts", id: "LIST" },
            ]
          : [{ type: "Posts", id: "LIST" }],
    }),
  }),
});

export const { useGetPostsQuery } = extendedApiSlice;

export const selectPostResults =
  extendedApiSlice.endpoints.getPosts.select(undefined);

//** similar with postsAdapter.getSelector to normalize state object with ids & entities */
const selectPostsData = createSelector(
  selectPostResults,
  (postResults) => postResults.data
);

export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = postsAdapter.getSelectors<RootState>(
  (state) => selectPostsData(state) ?? initialState
);
