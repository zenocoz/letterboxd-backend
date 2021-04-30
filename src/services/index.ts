import { Router } from "express";

import usersRouter from "./users/users.route";
import filmsRouter from "./films/films.route";
import reviewsRouter from "./reviews/reviews.route";
import clubsRouter from "./clubs/clubs.route";

const router = Router();

router.use("/users", usersRouter);
router.use("/films", filmsRouter);
router.use("/reviews", reviewsRouter);
router.use("/clubs", clubsRouter);

export default router;
