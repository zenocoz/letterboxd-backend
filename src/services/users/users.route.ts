import { Router } from "express";

import passport from "@utils/passport/passport";

import { tokenHandler } from "@middlewares/TokenHandler/TokenHandler";

import Users from "./users.schema";

import ApiError from "@classes/ApiError/ApiError";

const router = Router();

router.post("/register", passport.authenticate("auth.register"), tokenHandler);

router.post("/login", passport.authenticate("auth.login"), tokenHandler);

router.get("/me", passport.authenticate("auth.jwt"), tokenHandler);

router.get("/:id", passport.authenticate("scope.me"), tokenHandler);

router.get("/", async (req, res, next) => {
  try {
    console.log(req.headers);
    const members = await Users.find({});
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
