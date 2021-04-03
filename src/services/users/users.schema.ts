import bcrypt from "bcrypt";

import { model, Schema } from "mongoose";

import { IUsersModel } from "./users.d";

import { IUsers } from "./users";

const userSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, unique: false },
    password: { type: String, required: true },
    watchedMovies: [{ type: Schema.Types.ObjectId, ref: "Movies" }],
    watchList: [{ type: Schema.Types.ObjectId, ref: "Movies" }],
    following: [{ type: Schema.Types.ObjectId, ref: "Users" }],
    followers: [{ type: Schema.Types.ObjectId, ref: "Users" }],
    reviews: [],
  },
  { timestamps: true }
);

userSchema.pre<IUsers>("save", async function (next) {
  try {
    this.password = await bcrypt.hash(this.password, 8);

    next();
  } catch (e) {
    console.log(e);
  }
});

userSchema.static(
  "addMovieToWatchedList",
  async function (this: IUsersModel, userId, movieId): Promise<any> {
    await model<IUsers>("Users", userSchema).findOneAndUpdate(userId, {
      $addToSet: { watchedMovies: movieId },
    });
  }
);

export default model<IUsers>("Users", userSchema);
