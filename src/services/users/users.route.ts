import { Router } from "express";

import passport from "@utils/passport/passport";

import { tokenHandler } from "@middlewares/TokenHandler/TokenHandler";

import Users from "./users.schema";
import UserModel from "../users/users.schema";

import { IUsers } from "./users.d";

import ApiError from "@classes/ApiError/ApiError";

const mongoose = require("mongoose");

const router = Router();

router.post("/register", passport.authenticate("auth.register"), tokenHandler);

router.post("/login", passport.authenticate("auth.login"), tokenHandler);

router.get("/me", passport.authenticate("auth.jwt"), tokenHandler);

router.get("/:id", passport.authenticate("scope.me"), tokenHandler);

router.get("/", async (req, res, next) => {
  try {
    console.log(req.headers);
    const members = await Users.find(
      {},
      {
        email: 0,
        username: 0,
        password: 0,
        watchList: 0,
        following: 0,
        followers: 0,
        reviews: 0,
        watchedMovies: 0,
      }
    );
    if (members) {
      res.send(members);
    } else {
      console.log("there are no members");
    }
  } catch (err) {
    console.log(err);
    next(new ApiError(500, "could not retrieve members", false));
  }
});

router.put(
  "/:id",
  passport.authenticate("scope.me"),
  async (req, res, next) => {
    try {
      const user = await Users.findByIdAndUpdate(req.params.id, req.body);
      res.send(user);
    } catch (e) {
      next(new ApiError(500, "Update profile is not successfull", false));
    }
  }
);

router.delete(
  "/:id",
  passport.authenticate("scope.me"),
  async (req, res, next) => {
    try {
      const user = await Users.findByIdAndDelete(req.params.id);
      res.send(user);
    } catch (e) {
      next(new ApiError(500, "Delete profile is not successfull", false));
    }
  }
);

router.post("/:userId/follow/:memberId", async (req, res, next) => {
  try {
    const user: IUsers = await Users.findByIdAndUpdate(
      {
        _id: req.params.userId,
      },
      {
        $addToSet: {
          following: { _id: mongoose.Types.ObjectId(req.params.memberId) },
        },
      }
    );
    if (user) {
      const member: IUsers = await UserModel.addFollower(
        mongoose.Types.ObjectId(req.params.memberId),
        mongoose.Types.ObjectId(req.params.userId)
      );
      if (member) {
        res.send(member);
      } else {
        console.log("member not found");
      }
    }
  } catch (err) {
    console.log(err);
    next(new ApiError(500, "Couldn't follow user", false));
  }
});

//unfollow
router.put("/:userId/follow/:memberId", async (req, res, next) => {
  try {
    const user: IUsers = await Users.findByIdAndUpdate(
      {
        _id: req.params.userId,
      },
      {
        $pull: {
          following: { _id: mongoose.Types.ObjectId(req.params.memberId) },
        },
      }
    );
    if (user) {
      const member: IUsers = await UserModel.removeFollower(
        mongoose.Types.ObjectId(req.params.memberId),
        mongoose.Types.ObjectId(req.params.userId)
      );
      if (member) {
        res.send(member);
      } else {
        console.log("member not found");
      }
    }
  } catch (err) {
    console.log(err);
    next(new ApiError(500, "Couldn't follow user", false));
  }
});

//get user films
router.get("/films/:userId", async (req, res, next) => {
  try {
    const user = await Users.findById(req.params.userId).populate(
      "watchedMovies"
    );
    if (user) {
      res.send(user.watchedMovies);
    } else {
      console.log("couldn't find user ");
    }
  } catch (err) {
    console.log(err);
    next(new ApiError(500, "Couldn't retrieve watched movies", false));
  }
});

//used other endpoint in films
// router.post("/:id/watched/:movieId", async (req, res, next) => {
//   try {
//     const user = await Users.findOneAndUpdate(
//       { _id: req.params.id },
//       {
//         $push: { watchedMovies: req.params.movieId },
//       }
//     );
//     if (user) {
//       res.status(201).send(user);
//     }
//   } catch (err) {
//     next(new ApiError(500, "watched movie not successfull", false));
//   }
// });

// router.get("/meBe", async (req, res, next) => {
//   try {
//     res.send(req.user);
//   } catch (error) {
//     next(error);
//   }
// });
export default router;
