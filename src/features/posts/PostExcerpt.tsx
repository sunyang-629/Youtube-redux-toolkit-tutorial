import React from "react";
import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import ReactionButton from "./ReactionButton";
import { IPostType } from "../../types/post";
import { Link } from "react-router-dom";

interface IPostExcerpt {
  post: IPostType;
}

let PostExcerpt: React.FC<IPostExcerpt> = ({ post }) => {
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

PostExcerpt = React.memo(PostExcerpt);

export default PostExcerpt;
