import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { store } from "./app/store";
import { Provider } from "react-redux";
import { fetchUsers } from "./features/users/usersSlice.ts";
import router from "./routes/routes.tsx";
import { RouterProvider } from "react-router-dom";
import { fetchPosts } from "./features/posts/postsSlice.ts";

store.dispatch(fetchUsers());
store.dispatch(fetchPosts()); //! avoid refetching every time when focusing on the post list page

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
