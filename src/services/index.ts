import { Router } from "express";

import usersRouter from "@services/users/users.route";
import filmsRouter from "@services/films/films.route";

const router = Router();

router.use("/users", usersRouter);
router.use("/films", filmsRouter);

export default router;
