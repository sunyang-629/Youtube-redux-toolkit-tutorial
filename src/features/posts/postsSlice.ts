import {
  PayloadAction,
  createSlice,
  nanoid,
  createAsyncThunk,
  CaseReducer,
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
  posts: IPostType[];
  status: PostStatusType;
  error: string | null;
}

const initialState: IState = {
  posts: [] as IPostType[],
  status: "idle",
  error: null,
};

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
  IState,
  PayloadAction<{
    postId: string;
    reaction: keyof ReactionsType;
  }>
> = (state, action) => {
  const { postId, reaction } = action.payload;
  const existingPost = state.posts.find((post) => post.id === postId);
  if (existingPost) existingPost.reactions[reaction] += 1;
};

const postAddedReducer = {
  reducer: (state: IState, action: PayloadAction<IPostType>) => {
    state.posts.push(action.payload);
  },
  prepare: ({ title, body, userId }: NewPostType) => {
    return {
      payload: {
        id: nanoid(),
        title,
        body,
        userId,
        date: new Date().toISOString(),
        reactions: initialReactions,
      },
    };
  },
};

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    postAdded: postAddedReducer,
    reactionAdd: reactionAddReducer,
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

        state.posts = state.posts.concat(loadedPosts);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "";
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        action.payload.userId = Number(action.payload.userId);
        action.payload.date = new Date().toISOString();
        action.payload.reactions = initialReactions;
        state.posts.push(action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        if (!action.payload.id) {
          console.log("Update could not complete");
          return;
        }
        const { id } = action.payload;
        action.payload.date = new Date().toISOString();
        const posts = state.posts.filter((post) => post.id !== id);
        state.posts = [...posts, action.payload];
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        if (typeof action.payload === "string") {
          console.log("Delete could not complete");
          return;
        } else {
          const { id } = action.payload;
          const posts = state.posts.filter((post) => post.id !== id);
          state.posts = posts;
        }
      });
  },
});

export const selectAllPosts = (state: RootState) => state.posts.posts;
export const getPostsStatus = (state: RootState) => state.posts.status;
export const getPostError = (state: RootState) => state.posts.error;
export const selectPostById = (state: RootState, postId: string) =>
  state.posts.posts.find((post) => post.id.toString() === postId);

export const { postAdded, reactionAdd } = postsSlice.actions;

export default postsSlice.reducer;
