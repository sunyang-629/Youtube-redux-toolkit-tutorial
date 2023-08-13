import React from "react";
import { useAppSelector } from "../../app/hooks";
import { selectAllUsers } from "../users/usersSlice";

interface IPostAuthor {
  userId: number;
}

const PostAuthor: React.FC<IPostAuthor> = ({ userId }) => {
  const user = useAppSelector(selectAllUsers);
  const author = user.find((user) => user.id === userId);
  return <span>by {author ? author.name : "Unknown author"}</span>;
};

export default PostAuthor;
