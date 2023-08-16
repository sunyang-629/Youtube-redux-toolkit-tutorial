import React from "react";
import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import ReactionButton from "./ReactionButton";
// import { IPostType } from "../../types/post";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectPostById } from "./postsSlice";

interface IPostExcerpt {
  postId: string | number;
}

const PostExcerpt: React.FC<IPostExcerpt> = ({ postId }) => {
  const post = useAppSelector((state) => selectPostById(state, postId));

  if (!post) return null;

  return (
    <article>
      <h2>{post.title}</h2>
      <p className="excerpt">{post.body.substring(0, 75)}...</p>
      <p className="postCredit">
        <Link to={`post/${post.id}`}>View Post</Link>
        <PostAuthor userId={post.userId} />
        <TimeAgo timestamp={post.date} />
      </p>
      <ReactionButton post={post} />
    </article>
  );
};

//? Still rerender because of key changes ?
// PostExcerpt = React.memo(PostExcerpt);

export default PostExcerpt;
