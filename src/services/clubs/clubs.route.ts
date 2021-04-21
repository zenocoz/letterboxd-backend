import { Router } from "express";
import ApiError from "@classes/ApiError/ApiError";
import ClubModel from "./clubs.schema";
// const mongoose = require("mongoose");

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const newClub = await new ClubModel(req.body).save();
    if (newClub) {
      console.log("new club added to Database", newClub._id);
      res.send({ _id: newClub._id });
    } else {
      console.log("couldn't add newClub to Database");
    }
  } catch (err) {
    console.log(err);
    next(new ApiError(500, "Couldn't add new review", false));
  }
});

export default router;
