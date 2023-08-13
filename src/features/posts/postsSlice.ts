import {
  PayloadAction,
  createSlice,
  nanoid,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
// import { sub } from "date-fns";
import { PostType } from "./ReactionButton";
import axios from "axios";
import { sub } from "date-fns";
const POST_URL = "https://jsonplaceholder.typicode.com/posts";

interface IState {
  posts: PostType[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: IState = {
  posts: [] as PostType[],
  status: "idle",
  error: null,
};

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  // try {
  const response = await axios.get<PostType[]>(POST_URL);
  return response.data;
  // } catch (error) {
  //   if (isAxiosError(error)) return error.message;
  //   return "unknown error";
  // }
});

export const addNewPost = createAsyncThunk(
  "posts/addNewPost",
  async (initialPost: { title: string; body: string; userId: number }) => {
    const response = await axios.post<PostType>(POST_URL, initialPost);
    return response.data;
  }
);

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    postAdded: {
      reducer: (state, action: PayloadAction<PostType>) => {
        state.posts.push(action.payload);
      },
      prepare: ({
        title,
        body,
        userId,
      }: {
        title: string;
        body: string;
        userId: number;
      }) => {
        return {
          payload: {
            id: nanoid(),
            title,
            body,
            userId,
            date: new Date().toISOString(),
            reactions: {
              thumbsUp: 0,
              wow: 0,
              heart: 0,
              rocket: 0,
              coffee: 0,
            },
          },
        };
      },
    },
    reactionAdd: (
      state,
      action: PayloadAction<{
        postId: string;
        reaction: keyof {
          thumbsUp: number;
          wow: number;
          heart: number;
          rocket: number;
          coffee: number;
        };
      }>
    ) => {
      const { postId, reaction } = action.payload;
      const existingPost = state.posts.find((post) => post.id === postId);
      if (existingPost) existingPost.reactions[reaction] += 1;
    },
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
          reactions: {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
          },
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
        action.payload.reactions = {
          thumbsUp: 0,
          wow: 0,
          heart: 0,
          rocket: 0,
          coffee: 0,
        };
        state.posts.push(action.payload);
      });
  },
});

export const selectAllPosts = (state: RootState) => state.posts.posts;
export const getPostsStatus = (state: RootState) => state.posts.status;
export const getPostError = (state: RootState) => state.posts.error;

export const { postAdded, reactionAdd } = postsSlice.actions;

export default postsSlice.reducer;
