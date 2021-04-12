import { Document, Model, Schema } from "mongoose";

//TODO fix this
export interface IUsers extends Document {
  email: string;
  username: string;
  password: string;
  watchedMovies: Array<String>;
  watchList: Array<String>;
  following: Schema.Types.ObjectId[];
  followers: Schema.Types.ObjectId[];
  reviews: Array<IReview>;
}

export interface IUsersModel extends Model<IUsers> {
  addMovieToWatchedList: (
    userId: Schema.Types.ObjectId,
    movieId: Schema.Types.ObjectId
  ) => Promise<any>;
  removeMovieFromWatchedList: (
    userId: Schema.Types.ObjectId,
    movieId: Schema.Types.ObjectId
  ) => Promise<any>;
  addFollower: (
    memberId: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId
  ) => Promise<any>;
  removeFollower: (
    memberId: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId
  ) => Promise<any>;
}

// declare type StaticFunction = (args: any) => void;

export interface IImdbID extends Document {
  movieId: string;
}

export interface IReview extends Document {
  author: IUsers;
  movie: IImdbID;
  text: String;
  likes: Array<IUsers>;
}
