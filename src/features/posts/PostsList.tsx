import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { v4 as uuidv4 } from "uuid";
import {
  selectAllPosts,
  getPostsStatus,
  getPostError,
  fetchPosts,
} from "./postsSlice";
import PostExcerpt from "./PostExcerpt";

const PostsList: React.FC = () => {
  const dispatch = useAppDispatch();
  //if the shape of the state every chagnes, we'll just need to change it in slice
  const posts = useAppSelector(selectAllPosts);
  const postsStatus = useAppSelector(getPostsStatus);
  const error = useAppSelector(getPostError);

  React.useEffect(() => {
    if (postsStatus === "idle") dispatch(fetchPosts());
  }, [postsStatus, dispatch]);
  const orderedPosts = React.useMemo(() => {
    console.log({ posts });
    if (posts.length === 0) return posts;
    return posts.slice().sort((a, b) => b.date.localeCompare(a.date));
  }, [posts]);

  let content;
  if (postsStatus === "loading") {
    content = <p>"Loading..."</p>;
  } else if (postsStatus === "succeeded") {
    content = orderedPosts.map((post) => (
      <PostExcerpt post={post} key={uuidv4()} />
    ));
  } else if (postsStatus === "failed") {
    content = <p>{error}</p>;
  }

  return (
    <section>
      <h2>Posts</h2>
      {content}
    </section>
  );
};

export default PostsList;
