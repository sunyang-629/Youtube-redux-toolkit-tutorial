import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "../components/layouts/Layout";
import PostsList from "../features/posts/PostsList";
import AddPostForm from "../features/posts/AddPostForm";
import SinglePostPage from "../features/posts/SinglePostPage";
import EditPostForm from "../features/posts/EditPostForm";
import UserList from "../features/users/UserList";
import UserPage from "../features/users/UserPage";
import TodoList from "../features/todos/TodoList";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <PostsList />,
      },
      {
        path: "post",
        children: [
          {
            index: true,
            element: <AddPostForm />,
          },
          {
            path: ":postId",
            element: <SinglePostPage />,
          },
          {
            path: "edit/:postId",
            element: <EditPostForm />,
          },
        ],
      },
      {
        path: "user",
        children: [
          {
            index: true,
            element: <UserList />,
          },
          {
            path: ":userId",
            element: <UserPage />,
          },
        ],
      },
      {
        path: "todo",
        children: [
          {
            index: true,
            element: <TodoList />,
          },
        ],
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

export default router;
