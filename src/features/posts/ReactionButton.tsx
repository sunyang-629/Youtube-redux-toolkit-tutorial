import React from "react";
import { useAppDispatch } from "../../app/hooks";
import { reactionAdd } from "./postsSlice";
import { v4 as uuidv4 } from "uuid";

const reactionEmoji = {
  thumbsUp: "👍",
  wow: "😮",
  heart: "❤️",
  rocket: "🚀",
  coffee: "☕",
};

type ReactionsType = {
  thumbsUp: number;
  wow: number;
  heart: number;
  rocket: number;
  coffee: number;
};

interface IReactionButton {
  post: {
    id: string;
    title: string;
    content: string;
    userId: string;
    date: string;
    reactions: ReactionsType;
  };
}

const ReactionButton: React.FC<IReactionButton> = ({ post }) => {
  const dispatch = useAppDispatch();

  const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
    return (
      <button
        key={uuidv4()}
        type="button"
        className="reactionButton"
        onClick={() =>
          dispatch(
            reactionAdd({
              postId: post.id,
              reaction: name as keyof ReactionsType,
            })
          )
        }
      >
        {emoji} {post.reactions[name as keyof ReactionsType]}
      </button>
    );
  });
  return <div>{reactionButtons}</div>;
};

export default ReactionButton;
