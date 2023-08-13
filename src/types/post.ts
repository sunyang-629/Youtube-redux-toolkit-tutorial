export type NewPostType = {
  title: string;
  body: string;
  userId: number;
};

export type ReactionsType = {
  thumbsUp: number;
  wow: number;
  heart: number;
  rocket: number;
  coffee: number;
};

export interface IPostType extends NewPostType {
  id: string;
  date: string;
  reactions: ReactionsType;
}

export type PostStatusType =
  | "idle"
  | "loading"
  | "succeeded"
  | "failed"
  | "fulfilled";
