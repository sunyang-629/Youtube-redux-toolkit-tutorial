import React from "react";
import { Link } from "react-router-dom";
// import { useAppDispatch } from "../../app/hooks";
// import { getCount, increaseCount } from "../../features/posts/postsSlice";

const Header: React.FC = () => {
  // const dispatch = useAppDispatch();
  // const count = useAppSelector(getCount);
  return (
    <header className="Header">
      <h1>Redux Blog</h1>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="post">Post</Link>
          </li>
          <li>
            <Link to="user">User</Link>
          </li>
        </ul>
        {/* <button onClick={() => dispatch(increaseCount())}>{count}</button> */}
      </nav>
    </header>
  );
};

export default Header;
