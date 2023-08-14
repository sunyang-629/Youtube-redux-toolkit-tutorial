import React from "react";
import { useAppSelector } from "../../app/hooks";
import { selectPostById } from "./postsSlice";
import TimeAgo from "./TimeAgo";
import ReactionButton from "./ReactionButton";
import PostAuthor from "./PostAuthor";
import { useParams, Link } from "react-router-dom";

const SinglePostPage: React.FC = () => {
  const { postId } = useParams();
  const post = useAppSelector((state) => selectPostById(state, postId || ""));

  if (!post) {
    return (
      <section>
        <h2>Post not found</h2>
      </section>
    );
  }
  return (
    <article>
      <h2>{post.title}</h2>
      <p>{post.body}</p>
      <p className="postCredit">
        <Link to={`/post/edit/${post.id}`}>Edit Post</Link>
        <PostAuthor userId={post.userId} />
        <TimeAgo timestamp={post.date} />
      </p>
      <ReactionButton post={post} />
    </article>
  );
};

export default SinglePostPage;
