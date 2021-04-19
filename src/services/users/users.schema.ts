import bcrypt from "bcrypt";

import { model, Schema } from "mongoose";

import { IUsersModel } from "./users.d";

import { IUsers } from "./users";

const userSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, unique: false },
    password: { type: String, required: true },
    watchedMovies: [
      {
        _id: { type: Schema.Types.ObjectId, ref: "Movies" },
        rating: { type: Number },
      },
    ],
    watchList: [{ _id: { type: Schema.Types.ObjectId, ref: "Movies" } }],
    following: [{ _id: { type: Schema.Types.ObjectId, ref: "Users" } }],
    followers: [{ _id: { type: Schema.Types.ObjectId, ref: "Users" } }],
    reviews: [{ _id: { type: Schema.Types.ObjectId, ref: "Reviews" } }],
    picture: { type: String, required: false },
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
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
    ).findByIdAndUpdate(
      { _id: userId },
      {
        $addToSet: { watchedMovies: { _id: movieId, rating: 0 } },
      }
    );
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
      $pull: { watchedMovies: { _id: movieId } },
    });
    return userUpdated;
  }
);

userSchema.static(
  "addRatingToWatchedList",
  async function (this, userId, movieId, rating): Promise<any> {
    console.log(userId, movieId, rating);
    const memberUpdated = await model<IUsers>(
      "Users",
      userSchema
    ).findOneAndUpdate(
      { _id: userId, "watchedMovies._id": movieId },
      { $set: { "watchedMovies.$.rating": rating } }
    );
    console.log("member updated");
    return memberUpdated;
  }
);

userSchema.static(
  "addFollower",
  async function (this, memberId, userId): Promise<any> {
    const memberUpdated = await model<IUsers>(
      "Users",
      userSchema
    ).findByIdAndUpdate(memberId, {
      $addToSet: { followers: { _id: userId } },
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
      $pull: { followers: { _id: userId } },
    });
    return memberUpdated;
  }
);

userSchema.static(
  "addReview",
  async function (this, userId, reviewId): Promise<any> {
    const memberUpdated = await model<IUsers>(
      "Users",
      userSchema
    ).findByIdAndUpdate(userId, {
      $push: { reviews: reviewId },
    });
    return memberUpdated;
  }
);

userSchema.virtual("totalWatched").get(function () {
  if (this.watchedMovies) {
    return this.watchedMovies.length;
  }
});

//TODO other virtuals not working
// userSchema.virtual("totalFollowers").get(function () {
//   if (this.followers) {
//     return this.followers.length;
//   }
// });
// userSchema.virtual("totalReviews").get(function () {
//   if (this.reviews) {
//     return this.reviews.length;
//   }
// });
// userSchema.virtual("socialData").get(function () {
//   return {
//     totalWatched: this.watchedMovies.length,
//     totalReviews: this.reviews.length,
//     totalFollowers: this.followers.length,
//     totalFollowing: this.following.length,
//   };
// });

export default model<IUsers, IUsersModel>("Users", userSchema);
