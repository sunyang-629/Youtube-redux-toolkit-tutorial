import {
  PayloadAction,
  createSlice,
  nanoid,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import { sub } from "date-fns";
import {
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

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const response = await axios.get<IPostType[]>(POST_URL);
  return response.data;
});

export const addNewPost = createAsyncThunk(
  "posts/addNewPost",
  //! Must defined the type of argument here, otherwise it will cause issue in dispatch
  async (initialPost: NewPostType) => {
    const response = await axios.post<IPostType>(POST_URL, initialPost);
    return response.data;
  }
);

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    postAdded: {
      reducer: (state, action: PayloadAction<IPostType>) => {
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
        reaction: keyof ReactionsType;
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
