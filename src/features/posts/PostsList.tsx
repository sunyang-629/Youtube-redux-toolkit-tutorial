import React from "react";
import { useAppSelector } from "../../app/hooks";
// import { v4 as uuidv4 } from "uuid";
import { useGetPostsQuery, selectPostIds } from "./postsSlice";
import PostExcerpt from "./PostExcerpt";
// import { PayloadAction } from "@reduxjs/toolkit";

const PostsList: React.FC = () => {
  const { isLoading, isSuccess, isError, error } = useGetPostsQuery();

  const orderedPostIds = useAppSelector(selectPostIds);
  let content;

  if (isLoading) {
    content = <p>"Loading..."</p>;
  } else if (isSuccess) {
    content = orderedPostIds.map((postId) => (
      <PostExcerpt key={postId} postId={postId} />
    ));
  } else if (isError) {
    content = <p>{JSON.stringify(error)}</p>;
  }

  return (
    <section>
      {/* <h2>Posts</h2> */}
      {content}
    </section>
  );
};

export default PostsList;
