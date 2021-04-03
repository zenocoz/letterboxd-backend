import { Document, Model, Schema } from "mongoose";
import UsersModel from "./users.schema";

//TODO fix this
export interface IUsers extends Document {
  email: string;
  username: string;
  password: string;
  watchedMovies: Array<String>;
  watchList: Array<String>;
  following: Array<IUsers>;
  reviews: Array<IReview>;
}

export interface IUsersModel extends Model<any> {
  addMovieToWatchedList: (
    userId: Schema.Types.ObjectId,
    movieId: Schema.Types.ObjectId
  ) => Promise<any>;
}

declare type StaticFunction = (args: any) => void;

export interface IImdbID extends Document {
  movieId: string;
}

export interface IReview extends Document {
  author: IUsers;
  movie: IImdbID;
  text: String;
  likes: Array<IUsers>;
}
