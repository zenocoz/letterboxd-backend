import { IMovie } from "./films.d";
import MovieModel from "./films.schema";

export const writeDB = async (data: IMovie) => {
  try {
    const {
      Title,
      Year,
      Runtime,
      Genre,
      Director,
      Writer,
      Actors,
      Plot,
      Language,
      Country,
      Poster,
      imdbID,
    } = data;
    const myMovieObj = {
      Title,
      Year,
      Runtime,
      Genre,
      Director,
      Writer,
      Actors,
      Plot,
      Language,
      Country,
      Poster,
      imdbID,
    };

    await new MovieModel(myMovieObj).save();
    console.log("movie added", { movie: myMovieObj });
  } catch (err) {
    console.log(err);
  }
};
