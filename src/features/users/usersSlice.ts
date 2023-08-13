import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";

const USERS_URL = "https://jsonplaceholder.typicode.com/users";

type UserType = {
  id: number;
  name: string;
};

// interface IState {
//   users: UserType[];
//   status: "idle" | "loading" | "succeeded" | "failed";
//   error: string | null;
// }

const initialState: UserType[] = [];

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await axios.get(USERS_URL);
  return response.data;
});

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.fulfilled, (_state, action) => {
      return action.payload;
    });
  },
});

export const selectAllUsers = (state: RootState) => state.users;

export default usersSlice.reducer;
