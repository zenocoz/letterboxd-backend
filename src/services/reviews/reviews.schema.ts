import { model, Schema } from "mongoose";

import { IReview } from "./reviews.d";

const ReviewSchema: Schema = new Schema(
  {
    authorId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    movieId: { type: Schema.Types.ObjectId, ref: "Movies", required: true },
    text: { type: String, required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: "Users" }],
  },
  { timestamps: true }
);

const ReviewModel: any = model<IReview>("Reviews", ReviewSchema);
export default ReviewModel;
