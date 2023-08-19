import React from "react";
// import { useAppDispatch } from "../../app/hooks";
import { useAddReactionMutation } from "./postsSlice";
import { v4 as uuidv4 } from "uuid";
import { IPostType, ReactionsType } from "../../types/post";

const reactionEmoji = {
  thumbsUp: "👍",
  wow: "😮",
  heart: "❤️",
  rocket: "🚀",
  coffee: "☕",
};

interface IReactionButton {
  post: IPostType;
}

const ReactionButton: React.FC<IReactionButton> = ({ post }) => {
  const [addReaction] = useAddReactionMutation();
  const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
    return (
      <button
        key={uuidv4()}
        type="button"
        className="reactionButton"
        onClick={() => {
          const newValue = post.reactions[name as keyof ReactionsType] + 1;
          addReaction({
            postId: Number(post.id),
            reactions: { ...post.reactions, [name]: newValue },
          });
        }}
      >
        {emoji} {post.reactions[name as keyof ReactionsType]}
      </button>
    );
  });
  return <div>{reactionButtons}</div>;
};

export default ReactionButton;
