import { Router } from "express";

import passport from "../../utils/passport/passport";

import { tokenHandler } from "../../middlewares/TokenHandler/TokenHandler";

import Users from "./users.schema";
import UserModel from "../users/users.schema";

import { IUsers } from "./users.d";

import ApiError from "../../classes/ApiError/ApiError";
// import { ResetToken } from "@utils/jwt/jwt";

//cloudinary
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../../middlewares/cloudinary");
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "striveTest",
  },
});
const cloudinaryMulter = multer({ storage });

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
        password: 0,
        watchList: 0,
        following: 0,
        followers: 0,
        reviews: 0,
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
          following: mongoose.Types.ObjectId(req.params.memberId),
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
          following: mongoose.Types.ObjectId(req.params.memberId),
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

router.put(
  "/:userId/modifyPicture",
  cloudinaryMulter.single("picture"),
  async (req, res, next) => {
    try {
      console.log({ file: req["file"] });
      const user = await Users.findByIdAndUpdate(
        { _id: req.params.userId },
        { $set: { picture: req["file"].path } }
      );
      if (user) {
        res.send("picture updated ");
      } else {
        console.log("problems updadting picture profile");
      }
      res.send("ok");
    } catch (err) {
      console.log(err);
      next(new ApiError(500, "Couldn't update profile picture", false));
    }
  }
);

router.get("/member/:id", async (req, res, next) => {
  try {
    const member = await Users.findById(req.params.id, { password: 0 });
    if (member) {
      //TODO add projections
      res.send(member);
    } else {
      console.log("member not found");
    }
  } catch (err) {
    console.log(err);
    next(new ApiError(500, "Couldn't find member by id", false));
  }
});

export default router;
