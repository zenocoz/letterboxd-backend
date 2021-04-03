import { model, Schema } from "mongoose";

import { IMovie } from "./films.d";

const MovieSchema: Schema = new Schema(
  {
    Title: { type: String, required: true },
    Year: { type: Number, required: true },
    Runtime: { type: String, required: true },
    Country: { type: String, required: true },
    Actors: { type: String, required: true },
    Director: { type: String, required: true },
    Writer: { type: String, required: true },
    Language: { type: String, required: true },
    Plot: { type: String, required: true },
    Genre: { type: String, required: true },
    imdbID: { type: String, required: true },
    Poster: { type: String, required: true },
    seenBy: [{ type: Schema.Types.ObjectId, ref: "Users" }],
  },
  { timestamps: true }
);

// MovieSchema.static("addMovieToDB", async function (movie: IMovie) {
//   try {
//     const {
//       Title,
//       Year,
//       Runtime,
//       Genre,
//       Director,
//       Writer,
//       Actors,
//       Plot,
//       Language,
//       Country,
//       Poster,
//       imdbID,
//     } = movie;
//     const myMovieObj = {
//       Title,
//       Year,
//       Runtime,
//       Genre,
//       Director,
//       Writer,
//       Actors,
//       Plot,
//       Language,
//       Country,
//       Poster,
//       imdbID,
//     };

//     await new MovieModel(myMovieObj).save();
//     console.log("movie added", { movie: myMovieObj });
//   } catch (err) {
//     console.log(err);
//   }
// });

const MovieModel: any = model<IMovie>("Movies", MovieSchema);

export default MovieModel;

// export default model<IMovie>("Movies", MovieSchema);