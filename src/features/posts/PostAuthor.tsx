import React from "react";
import { useAppSelector } from "../../app/hooks";
import { selectAllUsers } from "../users/usersSlice";
import { Link } from "react-router-dom";

interface IPostAuthor {
  userId: number;
}

const PostAuthor: React.FC<IPostAuthor> = ({ userId }) => {
  const user = useAppSelector(selectAllUsers);
  const author = user.find((user) => user.id === userId);
  return (
    <span>
      by&nbsp;
      {author ? (
        <Link to={`/user/${userId}`}>{author.name}</Link>
      ) : (
        "Unknown author"
      )}
    </span>
  );
};

export default PostAuthor;
