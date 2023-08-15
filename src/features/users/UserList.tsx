import React from "react";
import { useAppSelector } from "../../app/hooks";
import { selectAllUsers } from "./usersSlice";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";

const UserList: React.FC = () => {
  const users = useAppSelector(selectAllUsers);

  const renderedUsers = users.map((user) => (
    <li key={uuidv4()}>
      <Link to={`/user/${user.id}`}>{user.name}</Link>
    </li>
  ));

  return (
    <section>
      <h2>Users</h2>
      <ul>{renderedUsers}</ul>
    </section>
  );
};

export default UserList;
