import ApiError from "@classes/ApiError/ApiError";
import { verifyAccessToken } from "@utils/jwt/jwt";

import UsersModel from "@services/users/users.schema";

export const tokenHandler = (req: any, res, next) => {
  try {
    if (req.originalUrl.includes("/api/users/me")) {
      res.status(202).send(req.user);
    } else {
      if (req.query.returnToken === "true") {
        res.status(202).send(req.user);
      } else {
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

export const authorize = async (req, next) => {
  try {
    console.log("GELLO");
    const token = req.header("Authorization").replace("Bearer ", ""); //using bearer token in header
    console.log(token);
    // const token = req.cookies.accessToken //using cookies
    const decoded: any = await verifyAccessToken(token);
    const user = await UsersModel.findOne({ _id: decoded._id });
    if (!user) throw new Error();
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.log(error);
    const err: any = new Error("Authenticate");
    err.httpStatusCode = 401;
    next(err);
  }
};
