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
    if (req.query.query) {
      const movies: IMovie[] = await MovieModel.find({
        $or: [
          { Title: { $regex: req.query.query, $options: "i" } },
          { Director: { $regex: req.query.query, $options: "i" } },
          { Actors: { $regex: req.query.query, $options: "i" } },
        ],
      });
      if (movies.length > 0) {
        res.send(movies);
      } else {
        console.log("movie not in own database");
        //search and present results from external api
        const movies: any = await axios.get(`${omdbApi}&s=${req.query.query}`);
        res.send(movies.data.Search);
      }
    } else {
      const movie: IMovie = await MovieModel.findOne({
        imdbID: req.query.imdbId,
      }).exec();
      if (movie) {
        console.log(movie.Title, "retrieved from DB");
        res.send(movie);
      } else {
        // const titleSearch = "t=" + req.query.title;
        const imdbIdSearch = "i=" + req.query.imdbId;
        //ANY
        const result: any = await axios.get(`${omdbApi}&${imdbIdSearch}`, {
          method: "get",
          headers: { "Content-Type": "application/json" },
        });
        await writeDB(result.data);
        console.log("new movie added to DB");

        //fins and returns just added movie
        const movie: IMovie = await MovieModel.findOne({
          imdbID: req.query.imdbId,
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

router.get("/internal/:filmId", async (req, res, next) => {
  try {
    const movie = await MovieModel.findById(req.params.filmId);
    if (movie) {
      res.send(movie);
    } else {
      console.log("movie by id not found in internal DB");
    }
  } catch (err) {
    console.log(err);
    next(new ApiError(500, "Couldn't find movie by id", false));
  }
});

router.get("/globalData", async (req, res, next) => {
  try {
    const movies = await MovieModel.find(
      {},
      {
        reviews: 0,
        Title: 0,
        Year: 0,
        Runtime: 0,
        Director: 0,
        Writer: 0,
        Actors: 0,
        Plot: 0,
        Language: 0,
        Country: 0,
        Poster: 0,
        seenBy: 0,
      }
    );
    if (movies) {
      console.log(req);
      res.send(movies);
    } else {
      console.log("there are no movies");
    }
  } catch (err) {
    console.log(err);
    next(new ApiError(500, "problem fetching movie data", false));
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
        $inc: { views: 1 },
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

//unwatch
router.put("/:filmId/seen/:userId", async (req, res, next) => {
  try {
    const movie: IMovie = await MovieModel.findOneAndUpdate(
      { _id: req.params.filmId, views: { $gt: 0 } },
      {
        $pull: {
          seenBy: { _id: mongoose.Types.ObjectId(req.params.userId) },
        },
        $inc: { views: -1 },
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
    next(new ApiError(500, "Couldn't remove seenBy", false));
  }
});

router.put("/:filmId/rate", async (req, res, next) => {
  try {
    console.log("REQ BODY", req.body);
    const movie: IMovie = await MovieModel.findOneAndUpdate(
      { _id: req.params.filmId },
      { $set: { rating: req.body.globalRating } }
    );
    if (movie) {
      const user: IUsers = await UserModel.addRatingToWatchedList(
        mongoose.Types.ObjectId(req.body.userId),
        mongoose.Types.ObjectId(req.params.filmId),
        req.body.userRating
      );
      if (user) {
        res.send(movie);
      } else {
        console.log("user not found");
      }
    } else {
      console.log("coulnd't update movie");
    }
  } catch (err) {
    console.log(err);
    next(new ApiError(500, "Couldn't rate movie ", false));
  }
});

//clean movie arrays if needed for development
router.put("/cleanUpData/", async (req, res) => {
  try {
    const movies = await MovieModel.updateMany(
      {},
      {
        $set: { reviews: [], seenBy: [], views: 0, rating: 0 },
      }
    );
    res.send(movies);
  } catch (err) {
    console.log(req.headers);
  }
});

export default router;
