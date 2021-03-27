import { model, Schema } from "mongoose";

import { IMovie } from "./films.d";

const schema: Schema = new Schema(
  {
    Title: { type: String, required: true },
    Year: { type: Number, required: true },
    Runtime: { type: String, required: true },
    Country: { type: String, required: true },
    Actors: { type: String, required: true },
    Director: { type: String, required: true },
    Write: { type: String, required: true },
    Language: { type: String, required: true },
    Plot: { type: String, required: true },
    Genre: { type: String, required: true },
    imdbID: { type: String, required: true },
    Poster: { type: String, required: true },
  },
  { timestamps: true }
);

export default model<IMovie>("Movies", schema);
