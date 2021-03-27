import { Document } from "mongoose";
export interface IMovie extends Document {
  Title: string;
  Year: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Poster: string;
  imdbID: string;
}
