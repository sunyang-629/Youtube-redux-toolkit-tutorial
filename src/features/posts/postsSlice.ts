import {
  EntityState,
  createEntityAdapter,
  createSelector,
} from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { sub } from "date-fns";
import { IPostType, ReactionsType } from "../../types/post";
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
    getPosts: builder.query<EntityState<IPostType>, void>({
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
    getPostsByUserId: builder.query<EntityState<IPostType>, number>({
      query: (id) => `/posts?userId=${id}`,
      transformResponse: (responseData: IPostType[]) => {
        let min = 1;
        const loadedPosts = responseData.map((post) => {
          if (!post.date)
            post.date = sub(new Date(), { minutes: min++ }).toISOString();
          if (!post.reactions) post.reactions = initialReactions;
          return post;
        });
        return postsAdapter.setAll(initialState, loadedPosts);
      },
      providesTags: (result) =>
        result?.ids
          ? [...result.ids.map((id) => ({ type: "Posts" as const, id }))]
          : [],
    }),
    addNewPost: builder.mutation<IPostType, Partial<IPostType>>({
      query: (initialPost) => ({
        url: "/posts",
        method: "POST",
        body: {
          ...initialPost,
          userId: Number(initialPost.userId),
          date: new Date().toISOString(),
          reactions: initialReactions,
        },
      }),
      invalidatesTags: [{ type: "Posts", id: "LIST" }],
    }),
    updatePost: builder.mutation<
      IPostType,
      Partial<IPostType> & Pick<IPostType, "id">
    >({
      query: (initialPost) => ({
        url: `/posts/${initialPost.id}`,
        method: "PUT",
        body: {
          ...initialPost,
          date: new Date().toISOString(),
        },
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Posts", id: arg.id },
      ],
    }),
    deletePost: builder.mutation<number, { id: number }>({
      query: ({ id }) => ({
        url: `/posts/${id}`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Posts", id: arg.id },
      ],
    }),
    addReaction: builder.mutation<
      typeof initialState,
      { postId: number; reactions: ReactionsType }
    >({
      query: ({ postId, reactions }) => ({
        url: `posts/${postId}`,
        method: "PATCH",
        body: { reactions },
      }),
      onQueryStarted: async (
        { postId, reactions },
        { dispatch, queryFulfilled }
      ) => {
        const patchResult = dispatch(
          extendedApiSlice.util.updateQueryData(
            "getPosts",
            undefined,
            (draft) => {
              const post = draft.entities[postId];
              if (post) post.reactions = reactions; //update the data in cache before calling api
            }
          )
        );
        queryFulfilled.catch(patchResult.undo);
      },
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostsByUserIdQuery,
  useAddNewPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useAddReactionMutation,
} = extendedApiSlice;

export const selectPostResults = extendedApiSlice.endpoints.getPosts.select();

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
