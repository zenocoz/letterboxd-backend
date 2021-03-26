import bcrypt from "bcrypt";

import { model, Schema } from "mongoose";

import { IUsers } from "./users";

const schema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, unique: false },
    password: { type: String, required: true },
    watchedMovies: [{ type: String }], //imdbID
    watchList: [{ type: String }],
    following: [],
    followers: [],
    reviews: [],
  },
  { timestamps: true }
);

schema.pre<IUsers>("save", async function (next) {
  try {
    this.password = await bcrypt.hash(this.password, 8);

    next();
  } catch (e) {
    console.log(e);
  }
});

export default model<IUsers>("Users", schema);
