import { model, Schema } from "mongoose";

const ClubSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    members: [{ _id: { type: Schema.Types.ObjectId, ref: "Users" } }],
    films: [{ _id: { type: Schema.Types.ObjectId, ref: "Movies" } }],
  },
  { timestamps: true }
);

const ClubModel: any = model<any>("Clubs", ClubSchema);

export default ClubModel;
