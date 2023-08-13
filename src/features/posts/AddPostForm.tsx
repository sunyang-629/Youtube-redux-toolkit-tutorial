import React from "react";
import { useAppDispatch } from "../../app/hooks";
import { addNewPost } from "./postsSlice";
import { useAppSelector } from "../../app/hooks";
import { selectAllUsers } from "../users/usersSlice";
import { v4 as uuidv4 } from "uuid";
import { NewPostType } from "../../types/post";

const AddPostForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const [newPost, setNewPost] = React.useState<NewPostType>({
    title: "",
    body: "",
    userId: 0,
  });
  const [addRequestStatus, setAddRequestStatus] =
    React.useState<string>("idle");

  const users = useAppSelector(selectAllUsers);

  const onTitleChanged = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNewPost((post) => ({ ...post, title: e.target.value }));
  const onContentChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setNewPost((post) => ({ ...post, body: e.target.value }));
  const onAuthorChanged = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setNewPost((post) => ({ ...post, userId: Number(e.target.value) }));

  const canSave =
    Object.values(newPost).every(Boolean) && addRequestStatus === "idle";

  const onSavePostClicked = () => {
    if (canSave) {
      try {
        setAddRequestStatus("pending");
        //! unwrap allows you to throw the error form thunk, otherwise it will always return resovle
        dispatch(addNewPost(newPost)).unwrap();
        setNewPost({ title: "", body: "", userId: 0 });
      } catch (error) {
        console.error("Failed to save the post", error);
      } finally {
        setAddRequestStatus("idle");
      }
    }
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
          value={newPost.body}
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
