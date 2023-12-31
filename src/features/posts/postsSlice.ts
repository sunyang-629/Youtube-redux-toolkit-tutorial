import {
  PayloadAction,
  createSlice,
  createSelector,
  createAsyncThunk,
  CaseReducer,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import { sub } from "date-fns";
import {
  IEditPostType,
  IPostType,
  NewPostType,
  PostStatusType,
  ReactionsType,
} from "../../types/post";
const POST_URL = "https://jsonplaceholder.typicode.com/posts";

interface IState {
  // posts: IPostType[];
  status: PostStatusType;
  error: string | null;
  count: number;
}

export const postsAdapter = createEntityAdapter<IPostType>({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});
const initialState = postsAdapter.getInitialState<IState>({
  // posts: [] as IPostType[],
  status: "idle",
  error: null,
  count: 0,
});

const initialReactions = {
  thumbsUp: 0,
  wow: 0,
  heart: 0,
  rocket: 0,
  coffee: 0,
};

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async () => {
    const response = await axios.get<IPostType[]>(POST_URL);
    return response.data;
  },
  {
    //! Adding condition here to make sure api only calls one time in useEffect
    condition: (_state, { getState }) => {
      const { posts } = getState() as RootState;
      if (posts.status === "fulfilled" || posts.status === "loading")
        return false;
    },
  }
);

export const addNewPost = createAsyncThunk(
  "posts/addNewPost",
  //! Must defined the type of argument here, otherwise it will cause issue in dispatch
  async (initialPost: NewPostType) => {
    const response = await axios.post<IPostType>(POST_URL, initialPost);
    return response.data;
  }
);

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async (initialPost: IEditPostType) => {
    const { id } = initialPost;
    try {
      const response = await axios.put(`${POST_URL}/${id}`, initialPost);
      console.log({ response: response.data });
      return response.data;
    } catch (error) {
      return initialPost;
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (initialPost: { id: string }) => {
    const { id } = initialPost;
    try {
      const response = await axios.delete(`${POST_URL}/${id}`);
      if (response.status === 200) return initialPost;
      return `${response.status}:${response.statusText}`;
    } catch (error) {
      return initialPost;
    }
  }
);

const reactionAddReducer: CaseReducer<
  typeof initialState,
  PayloadAction<{
    postId: string;
    reaction: keyof ReactionsType;
  }>
> = (state, action) => {
  const { postId, reaction } = action.payload;
  const existingPost = state.entities[postId];
  // const existingPost = state.posts.find((post) => post.id === postId);
  if (existingPost) existingPost.reactions[reaction] += 1;
};
const increaseCountReducer: CaseReducer<typeof initialState, PayloadAction> = (
  state
) => {
  state.count = state.count + 1;
};

// const postAddedReducer = {
//   reducer: (state: IState, action: PayloadAction<IPostType>) => {
//     state.posts.push(action.payload);
//   },
//   prepare: ({ title, body, userId }: NewPostType) => {
//     return {
//       payload: {
//         id: nanoid(),
//         title,
//         body,
//         userId,
//         date: new Date().toISOString(),
//         reactions: initialReactions,
//       },
//     };
//   },
// };

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    // postAdded: postAddedReducer,
    reactionAdd: reactionAddReducer,
    increaseCount: increaseCountReducer,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";

        let min = 1;
        const loadedPosts = action.payload.map((post) => ({
          ...post,
          date: sub(new Date(), { minutes: min++ }).toISOString(),
          reactions: initialReactions,
        }));

        // state.posts = state.posts.concat(loadedPosts);
        postsAdapter.upsertMany(state, loadedPosts);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "";
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        action.payload.userId = Number(action.payload.userId);
        action.payload.date = new Date().toISOString();
        action.payload.reactions = initialReactions;
        // state.posts.push(action.payload);
        postsAdapter.addOne(state, action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        if (!action.payload.id) {
          console.log("Update could not complete");
          return;
        }
        // const { id } = action.payload;
        action.payload.date = new Date().toISOString();
        // const posts = state.posts.filter(
        //   (post) => post.id.toString() !== id.toString()
        // );
        // state.posts = [...posts, action.payload];
        postsAdapter.upsertOne(state, action.payload);
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        if (typeof action.payload === "string") {
          console.log("Delete could not complete");
          return;
        } else {
          const { id } = action.payload;
          // const posts = state.posts.filter((post) => post.id.toString() !== id);
          // state.posts = posts;
          postsAdapter.removeOne(state, id);
        }
      });
  },
});

export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = postsAdapter.getSelectors<RootState>((state) => state.posts);
// export const selectAllPosts = (state: RootState) => state.posts.posts;
export const getPostsStatus = (state: RootState) => state.posts.status;
export const getPostError = (state: RootState) => state.posts.error;
// export const selectPostById = (state: RootState, postId: string) =>
//   state.posts.posts.find((post) => post.id.toString() === postId);
export const selectPostsByUser = createSelector(
  [selectAllPosts, (_state, userId) => userId],
  (posts, userId) => posts.filter((post) => post.userId === userId)
);

export const getCount = (state: RootState) => state.posts.count;

export const {
  // postAdded,
  increaseCount,
  reactionAdd,
} = postsSlice.actions;

export default postsSlice.reducer;
