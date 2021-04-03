import { Router } from "express";
import axios from "axios";
import ApiError from "@classes/ApiError/ApiError";
import MovieModel from "./films.schema";
import { IMovie } from "./films.d";
const mongoose = require("mongoose");

import { writeDB } from "./utils";

const router = Router();

const omdbApi = "http://omdbapi.com/?apikey=d541d8b3";

router.get("/", async (req, res, next) => {
  try {
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
      // await MovieModel.addMovieToDB(result.data);

      console.log("new movie added to DB");
      res.send(result.data);
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
        $push: { seenBy: { _id: mongoose.Types.ObjectId(req.params.userId) } },
      }
    );
    if (movie) {
      res.send(movie);
    }
  } catch (err) {
    console.log(err);
    next(new ApiError(500, "Couldn't add seen by", false));
  }
});
export default router;
