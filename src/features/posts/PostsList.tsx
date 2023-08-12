import React from "react";
import { useAppSelector } from "../../app/hooks";
import { v4 as uuidv4 } from "uuid";
import { selectAllPosts } from "./postsSlice";
import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";

const PostsList: React.FC = () => {
  //if the shape of the state every chagnes, we'll just need to change it in slice
  const posts = useAppSelector(selectAllPosts);

  const orderedPosts = React.useMemo(() => {
    return posts.slice().sort((a, b) => b.date.localeCompare(a.date));
  }, [posts]);

  const renderedPosts = orderedPosts.map((post) => (
    <article key={uuidv4()}>
      <h3>{post.title}</h3>
      <p>{post.content.substring(0, 100)}</p>
      <p className="postCredit">
        <PostAuthor userId={post.userId} />
        <TimeAgo timestamp={post.date} />
      </p>
    </article>
  ));
  return (
    <section>
      <h2>Posts</h2>
      {renderedPosts}
    </section>
  );
};

export default PostsList;
