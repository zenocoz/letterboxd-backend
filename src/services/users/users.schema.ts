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
  async function (this, userId, movieId): Promise<any> {
    console.log(userId);
    const userUpdated = await model<IUsers>(
      "Users",
      userSchema
    ).findByIdAndUpdate(userId, {
      $addToSet: { watchedMovies: movieId },
    });
    return userUpdated;
  }
);

userSchema.static(
  "removeMovieFromWatchedList",
  async function (this, userId, movieId): Promise<any> {
    const userUpdated = await model<IUsers>(
      "Users",
      userSchema
    ).findByIdAndUpdate(userId, {
      $pull: { watchedMovies: movieId },
    });
    return userUpdated;
  }
);

userSchema.static(
  "addFollower",
  async function (this, memberId, userId): Promise<any> {
    const memberUpdated = await model<IUsers>(
      "Users",
      userSchema
    ).findByIdAndUpdate(memberId, {
      $addToSet: { followers: userId },
    });
    return memberUpdated;
  }
);

userSchema.static(
  "removeFollower",
  async function (this, memberId, userId): Promise<any> {
    const memberUpdated = await model<IUsers>(
      "Users",
      userSchema
    ).findByIdAndUpdate(memberId, {
      $pull: { followers: userId },
    });
    return memberUpdated;
  }
);

export default model<IUsers, IUsersModel>("Users", userSchema);
