import { Router } from "express";
import axios from "axios";
import ApiError from "@classes/ApiError/ApiError";
import MovieModel from "./films.schema";
import { IMovie } from "./films.d";
import { IUsers } from "../users/users.d";
import UserModel from "../users/users.schema";
const mongoose = require("mongoose");

import { writeDB } from "./utils";

const router = Router();

const omdbApi = "http://omdbapi.com/?apikey=d541d8b3";

router.get("/", async (req, res, next) => {
  try {
    if (req.query) {
      console.log(req.query);
      const movies: IMovie[] = await MovieModel.find({
        $or: [
          { Title: { $regex: req.query.query, $options: "i" } },
          { Director: { $regex: req.query.query, $options: "i" } },
          { Actors: { $regex: req.query.query, $options: "i" } },
        ],
      });
      if (movies) {
        console.log("regex found", movies);
        res.send(movies);
      }
    } else {
      const movie: IMovie = await MovieModel.findOne({
        Title: req.query.title,
      }).exec();
      if (movie) {
        console.log(movie.Title, "retrieved from DB");
        res.send(movie);
      } else {
        const titleSearch = "t=" + req.query.title;
        //ANY
        const result: any = await axios.get(`${omdbApi}&${titleSearch}`, {
          method: "get",
          headers: { "Content-Type": "application/json" },
        });
        await writeDB(result.data);
        console.log("new movie added to DB");

        //fins and returns just added movie
        const movie: IMovie = await MovieModel.findOne({
          Title: req.query.title,
        }).exec();
        if (movie) {
          console.log(movie.Title, "retrieved from DB");
          res.send(movie);
        } else {
          console.log("ERROR IN RETRIEVING JUST CREATED MOVIE IN DB");
        }
      }
    }
  } catch (err) {
    console.log(err);
    next(new ApiError(500, "Couldn't fetch MovieModel", false));
  }
});

router.post("/:filmId/seen/:userId", async (req, res, next) => {
  try {
    const movie: IMovie = await MovieModel.findByIdAndUpdate(
      {
        _id: req.params.filmId,
      },
      {
        $addToSet: {
          seenBy: { _id: mongoose.Types.ObjectId(req.params.userId) },
        },
      }
    );
    if (movie) {
      const user: IUsers = await UserModel.addMovieToWatchedList(
        mongoose.Types.ObjectId(req.params.userId),
        mongoose.Types.ObjectId(req.params.filmId)
      );
      if (user) {
        res.send(movie);
      } else {
        console.log("user not found");
      }
    }
  } catch (err) {
    console.log(err);
    next(new ApiError(500, "Couldn't add seen by", false));
  }
});

router.put("/:filmId/seen/:userId", async (req, res, next) => {
  try {
    const movie: IMovie = await MovieModel.findByIdAndUpdate(
      req.params.filmId,
      {
        $pull: {
          seenBy: { _id: mongoose.Types.ObjectId(req.params.userId) },
        },
      }
    );

    if (movie) {
      const user: IUsers = await UserModel.removeMovieFromWatchedList(
        mongoose.Types.ObjectId(req.params.userId),
        mongoose.Types.ObjectId(req.params.filmId)
      );
      if (user) {
        res.send(movie);
      } else {
        console.log("user not found");
      }
    }
  } catch (err) {
    console.log(err);
    console.log(err);
    next(new ApiError(500, "Couldn't remove seenBy", false));
  }
});

export default router;
