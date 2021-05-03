import ApiError from "../../classes/ApiError/ApiError";

export const tokenHandler = (req: any, res, next) => {
  try {
    if (req.originalUrl.includes("/api/users/me")) {
      res.status(202).send(req.user);
    } else {
      if (req.query.returnToken === "true") {
        res.status(202).send(req.user);
      } else {
        const cookieTEST = res.cookie("accessToken", req.user.accessToken);
        console.log(cookieTEST);
        res.cookie("accessToken", req.user.accessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });
        res.cookie("refreshToken", req.user.refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });
        delete req.user.accessToken;
        delete req.user.refreshToken;
        res.send(req.user);
      }
    }
  } catch (e) {
    next(new ApiError(500, "An error occured.", true));
  }
};
