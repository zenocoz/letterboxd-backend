import cors from "cors";
import ApiError from "../../classes/ApiError/ApiError";
const whiteList =
  process.env.NODE_ENV === "production"
    ? [process.env.FRONTEND_PRODUCTION, process.env.FRONTEND_PROD_DEV]
    : [process.env.FRONTEND_DEV];

const corsOptions = {
  origin: function (origin, callback) {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      // allowed
      callback(null, true);
    } else {
      // Not allowed
      callback(
        new ApiError(401, `Your access has been blocked by CORS.`, false)
      );
    }
  },
  credentials: true,
  exposedHeaders: ["set-cookie"],
};

export default () => cors(corsOptions);
