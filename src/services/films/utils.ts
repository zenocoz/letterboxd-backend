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

    const seenBy = [];
    const views = 0;
    const rating = 0;
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
      seenBy,
      views,
      rating,
    };

    await new MovieModel(myMovieObj).save();
    console.log("movie added", { movie: myMovieObj });
  } catch (err) {
    console.log(err);
  }
};
