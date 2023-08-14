import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/layouts/Layout";
import PostsList from "../features/posts/PostsList";
import AddPostForm from "../features/posts/AddPostForm";
import SinglePostPage from "../features/posts/SinglePostPage";
import EditPostForm from "../features/posts/EditPostForm";

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
    ],
  },
]);

export default router;
