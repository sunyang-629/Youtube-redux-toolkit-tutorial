import React from "react";
import { useAppSelector } from "../../app/hooks";
// import { v4 as uuidv4 } from "uuid";
import {
  // selectAllPosts,
  getPostsStatus,
  getPostError,
  selectPostIds,
} from "./postsSlice";
import PostExcerpt from "./PostExcerpt";
// import { PayloadAction } from "@reduxjs/toolkit";

const PostsList: React.FC = () => {
  // const dispatch = useAppDispatch();
  //! if the shape of the state every chagnes, we'll just need to change it in slice
  // const posts = useAppSelector(selectAllPosts);
  //** Each unique instance of an entity is assumed to have a unique ID value in a specific field. */

  // {
  //   ** The unique IDs of each item. Must be strings or numbers
  //   ids: []
  //   ** A lookup table mapping entity IDs to the corresponding entity objects
  //   entities: {
  //   }
  // }
  const orderedPostIds = useAppSelector(selectPostIds); //! the id is from entity not from the post itself
  const postsStatus = useAppSelector(getPostsStatus);
  const error = useAppSelector(getPostError);

  // React.useEffect(() => {
  //   //! if condition has been added in the thunk, don't need to clean up promise here
  //   //! clean up promise but api still calls twice
  //   dispatch(fetchPosts());
  // }, [dispatch]);

  // const orderedPosts = React.useMemo(() => {
  //   if (posts.length === 0) return posts;
  //   return posts.slice().sort((a, b) => b.date.localeCompare(a.date));
  // }, [posts]);

  let content;
  // console.log({ postsStatus });
  if (postsStatus === "loading") {
    content = <p>"Loading..."</p>;
  } else if (postsStatus === "succeeded") {
    content = orderedPostIds.map((postId) => (
      <PostExcerpt key={postId} postId={postId} />
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
