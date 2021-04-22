import { Document } from "mongoose";
import { IUsers } from "../users/users.d";

// export interface IImdbID extends Document {
//     movieId: string;
//   }

export interface IReview extends Document {
  _id: string;
  authorId: string;
  movieId: string;
  text: String;
  likes: Array<IUsers>;
}
