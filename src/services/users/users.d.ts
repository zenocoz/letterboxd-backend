import { Document } from "mongoose";

//TODO fix this
export interface IUsers extends Document {
  email: string;
  username: string;
  password: string;
  watchedMovies: Array<String>;
  watchList: Array<String>;
  following: Array<IUsers>;
  followers: Array<IUsers>;
  reviews: Array<IReview>;
}

export interface IImdbID extends Document {
  movieId: string;
}

export interface IReview extends Document {
  author: IUsers;
  movie: IImdbID;
  text: String;
  likes: Array<IUsers>;
}
