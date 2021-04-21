import { Router } from "express";

import usersRouter from "@services/users/users.route";
import filmsRouter from "@services/films/films.route";
import reviewsRouter from "@services/reviews/reviews.route";
import clubsRouter from "@services/clubs/clubs.route";

const router = Router();

router.use("/users", usersRouter);
router.use("/films", filmsRouter);
router.use("/reviews", reviewsRouter);
router.use("/clubs", clubsRouter);

export default router;
