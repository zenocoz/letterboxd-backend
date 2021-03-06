import { Router } from "express";
import ApiError from "../../classes/ApiError/ApiError";
import ReviewModel from "./reviews.schema";
import { IMovie } from "../films/films.d";
import { IUsers } from "../users/users.d";
import UserModel from "../users/users.schema";
import MovieModel from "../films/films.schema";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const newReview = await new ReviewModel(req.body).save();
    console.log("review added to Database", newReview._id);
    if (newReview) {
      const user: IUsers = await UserModel.addReview(
        req.body.authorId,
        newReview._id
      );
      const movie: IMovie = await MovieModel.addReview(
        req.body.movieId,
        newReview._id
      );

      Promise.all([user, movie])
        .then((values) => {
          console.log(values);
          res.send(newReview);
        })
        .catch((err) => console.log(err));
    }
  } catch (err) {
    console.log(err);
    next(new ApiError(500, "Couldn't add new review", false));
  }
});

router.get("/", async (req, res, next) => {
  try {
    const reviews = await ReviewModel.find({});
    if (reviews) {
      res.send(reviews);
    } else {
      console.log("didn't find any reviews. Console loggin request: ", req);
    }
  } catch (err) {
    console.log(err);
    next(new ApiError(500, "Couldn't retrieve all the reviews", false));
  }
});

export default router;
