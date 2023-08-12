import React from "react";
// import { useAppDispatch } from "../../app/hooks";
// import { nanoid } from "@reduxjs/toolkit";
import { postAdded } from "./postsSlice";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../app/hooks";
import { selectAllUsers } from "../users/usersSlice";
import { v4 as uuidv4 } from "uuid";

const AddPostForm: React.FC = () => {
  const dispatch = useDispatch();
  const [newPost, setNewPost] = React.useState<{
    title: string;
    content: string;
    userId: string;
  }>({ title: "", content: "", userId: "" });

  const users = useAppSelector(selectAllUsers);

  const onTitleChanged = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNewPost((post) => ({ ...post, title: e.target.value }));
  const onContentChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setNewPost((post) => ({ ...post, content: e.target.value }));
  const onAuthorChanged = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setNewPost((post) => ({ ...post, userId: e.target.value }));

  const canSave =
    Boolean(newPost.title) &&
    Boolean(newPost.content) &&
    Boolean(newPost.userId);

  const onSavePostClicked = () => {
    if (canSave) {
      dispatch(postAdded({ ...newPost }));
    }
    setNewPost({ title: "", content: "", userId: "" });
  };

  const userOptions = React.useMemo(
    () =>
      users.map((user) => (
        <option value={user.id} key={uuidv4()}>
          {user.name}
        </option>
      )),
    [users]
  );

  return (
    <section>
      <h2>Add a New Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={newPost.title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postAuthor">Author:</label>
        <select
          name="postAuthor"
          id="postAuthor"
          value={newPost.userId}
          onChange={onAuthorChanged}
        >
          <option value=""></option>
          {userOptions}
        </select>
        <label htmlFor="postContent">Post Content:</label>
        <textarea
          name="postContent"
          id="postContent"
          value={newPost.content}
          onChange={onContentChanged}
        />
        <button type="button" disabled={!canSave} onClick={onSavePostClicked}>
          Save Post
        </button>
      </form>
    </section>
  );
};

export default AddPostForm;
