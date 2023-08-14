import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { selectPostById, updatePost, deletePost } from "./postsSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectAllUsers } from "../users/usersSlice";
import { NewPostType } from "../../types/post";
import { v4 as uuidv4 } from "uuid";

const EditPostForm: React.FC = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  console.log({ postId });
  const post = useAppSelector((state) => selectPostById(state, postId || ""));
  const users = useAppSelector(selectAllUsers);
  const dispatch = useAppDispatch();

  const [editPost, setEidtPost] = React.useState<NewPostType>({
    title: post?.title ?? "",
    body: post?.body ?? "",
    userId: post?.userId ?? 0,
  });
  const [addRequestStatus, setAddRequestStatus] =
    React.useState<string>("idle");

  const onTitleChanged = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEidtPost((post) => ({ ...post, title: e.target.value }));
  const onContentChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setEidtPost((post) => ({ ...post, body: e.target.value }));
  const onAuthorChanged = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setEidtPost((post) => ({ ...post, userId: Number(e.target.value) }));

  const canSave =
    Object.values(editPost).every(Boolean) && addRequestStatus === "idle";

  const onSavePostClicked = () => {
    if (canSave) {
      try {
        setAddRequestStatus("pending");
        // unwrap allows you to throw the error form thunk, otherwise it will always return resovle
        dispatch(
          updatePost({
            id: postId!,
            title: editPost.title,
            body: editPost.body,
            userId: editPost.userId,
            reactions: post!.reactions,
          })
        ).unwrap();
        // dispatch(updatePost(editPost)).unwrap();
        setEidtPost({ title: "", body: "", userId: 0 });
        navigate(`/post/${postId}`);
      } catch (error) {
        console.error("Failed to save the post", error);
      } finally {
        setAddRequestStatus("idle");
      }
    }
  };

  const onDeletePostClicked = () => {
    try {
      setAddRequestStatus("pending");
      dispatch(deletePost({ id: postId! })).unwrap();
      setEidtPost({ title: "", body: "", userId: 0 });
      navigate("/");
    } catch (error) {
      console.error("Failed to delete the post", error);
    } finally {
      setAddRequestStatus("idle");
    }
  };

  const usersOptions = React.useMemo(
    () =>
      users.map((user) => (
        <option value={user.id} key={uuidv4()}>
          {user.name}
        </option>
      )),
    [users]
  );

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    );
  }
  return (
    <section>
      <h2>Edit Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={editPost.title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postAuthor">Author:</label>
        <select
          id="postAuthor"
          value={editPost.userId}
          onChange={onAuthorChanged}
        >
          <option value=""></option>
          {usersOptions}
        </select>
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={editPost.body}
          onChange={onContentChanged}
        />
        <button type="button" onClick={onSavePostClicked} disabled={!canSave}>
          Save Post
        </button>
        <button
          className="deleteButton"
          type="button"
          onClick={onDeletePostClicked}
        >
          Delete Post
        </button>
      </form>
    </section>
  );
};

export default EditPostForm;
