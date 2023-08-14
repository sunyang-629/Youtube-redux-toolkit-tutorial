import React from "react";
import { useAppSelector } from "../../app/hooks";
import { v4 as uuidv4 } from "uuid";
import { selectAllPosts, getPostsStatus, getPostError } from "./postsSlice";
import PostExcerpt from "./PostExcerpt";
// import { PayloadAction } from "@reduxjs/toolkit";

const PostsList: React.FC = () => {
  // const dispatch = useAppDispatch();
  //! if the shape of the state every chagnes, we'll just need to change it in slice
  const posts = useAppSelector(selectAllPosts);
  const postsStatus = useAppSelector(getPostsStatus);
  const error = useAppSelector(getPostError);

  // React.useEffect(() => {
  //   //! if condition has been added in the thunk, don't need to clean up promise here
  //   //! clean up promise but api still calls twice
  //   dispatch(fetchPosts());
  // }, [dispatch]);

  const orderedPosts = React.useMemo(() => {
    if (posts.length === 0) return posts;
    return posts.slice().sort((a, b) => b.date.localeCompare(a.date));
  }, [posts]);

  let content;
  // console.log({ postsStatus });
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
      {/* <h2>Posts</h2> */}
      {content}
    </section>
  );
};

export default PostsList;
