import React from "react";
import { useParams, Link } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectUserById } from "./usersSlice";
import { selectAllPosts } from "../posts/postsSlice";
import { v4 as uuidv4 } from "uuid";

const UserPage: React.FC = () => {
  const { userId } = useParams();
  const user = useAppSelector((state) => selectUserById(state, Number(userId)));

  const postsForUser = useAppSelector((state) => {
    const allPosts = selectAllPosts(state);
    return allPosts.filter((post) => post.userId === Number(userId));
  });

  const postTitles = React.useMemo(() => {
    return postsForUser.map((post) => (
      <li key={uuidv4()}>
        <Link to={`/post/${post.id}`}>{post.title}</Link>
      </li>
    ));
  }, [postsForUser]);

  return (
    <section>
      <h2>{user?.name}</h2>
      <ol>{postTitles}</ol>
    </section>
  );
};

export default UserPage;
