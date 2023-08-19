import React from "react";
import { useParams, Link } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectUserById } from "./usersSlice";
import { useGetPostsByUserIdQuery } from "../posts/postsSlice";

const UserPage: React.FC = () => {
  const { userId } = useParams();
  const user = useAppSelector((state) => selectUserById(state, Number(userId)));

  const {
    data: postsForUser,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetPostsByUserIdQuery(Number(userId));

  const content = React.useMemo(() => {
    if (isLoading) {
      return <p>Loading...</p>;
    } else if (isSuccess) {
      const { ids, entities } = postsForUser;
      return ids.map((id) => (
        <li key={id}>
          <Link to={`/post/${id}`}>{entities[id]?.title}</Link>
        </li>
      ));
    } else if (isError) {
      return <p>{JSON.stringify(error)}</p>;
    }
  }, [postsForUser, isLoading, isError, isSuccess, error]);

  return (
    <section>
      <h2>{user?.name}</h2>
      <ol>{content}</ol>
    </section>
  );
};

export default UserPage;
