import ApiError from "../../classes/ApiError/ApiError";

export const tokenHandler = (req: any, res, next) => {
  console.log("token handler req.originalUrl", req.originalUrl);
  try {
    if (req.originalUrl.includes("/api/users/me")) {
      res.status(202).send(req.user);
    } else {
      if (req.query.returnToken === "true") {
        res.status(202).send(req.user);
      } else {
        console.log("COOKIE", res.cookie);

        res.cookie("accessToken", req.user.accessToken);
        res.cookie("refreshToken", req.user.refreshToken);
        delete req.user.accessToken;
        delete req.user.refreshToken;
        res.send(req.user);
      }
    }
  } catch (e) {
    next(new ApiError(500, "An error occured.", true));
  }
};
