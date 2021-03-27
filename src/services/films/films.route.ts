import { Router } from "express";
import axios from "axios";
import ApiError from "@classes/ApiError/ApiError";

const router = Router();

const omdbApi = "http://omdbapi.com/?apikey=d541d8b3";

router.get("/", async (req, res, next) => {
  try {
    console.log(req.query);
    const titleSearch = "t=" + req.query.title;
    //ANY
    const result: any = await axios.get(`${omdbApi}&${titleSearch}`, {
      method: "get",
      headers: { "Content-Type": "application/json" },
    });
    if (!result.errors) {
      console.log(result.data);
      res.send(result.data);
    }
  } catch (err) {
    console.log(err);
    next(new ApiError(500, "Couldn't fetch movies", false));
  }
});

export default router;
