import { Router } from "express";
import axios from "axios";
import ApiError from "@classes/ApiError/ApiError";

const router = Router();

const omdbApi = "http://omdbapi.com/?apikey=d541d8b3";

router.get("/", async (req, res, next) => {
  try {
    console.log(req.query);
    const titleSearch = "t=" + req.query.title;
    const result = await axios.get(`${omdbApi}&${titleSearch}`, {
      method: "get",
      headers: { "Content-Type": "application/json" },
    });
    console.log(result.data);
    res.send(result.data);
  } catch (err) {
    console.log(err);
    next(new ApiError(500, "Couldn't fetch movies", false));
  }
});

export default router;
