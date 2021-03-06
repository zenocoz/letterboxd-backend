import { model, Schema } from "mongoose";
import mongoose from "mongoose";
const id = mongoose.Types.ObjectId();

const ClubSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    members: [
      {
        clubMember: { type: Schema.Types.ObjectId, ref: "Users" },
        confirmed: {
          type: Schema.Types.Boolean,
          required: true,
        },
        chooser: {
          type: Schema.Types.Boolean,
          required: true,
        },
        filmSelected: {
          type: Schema.Types.Boolean,
          required: true,
        },
        email: { type: String },
        film: { type: Schema.Types.ObjectId, ref: "Movies", default: id },
      },
    ],
    watching: {
      type: Schema.Types.Boolean,
      required: true,
    },
    films: [{ type: Schema.Types.ObjectId, ref: "Movies" }],
  },
  { timestamps: true }
);

ClubSchema.static(
  "acceptInvitation",
  async function (this, clubId, memberId): Promise<any> {
    console.log("clubId", clubId);
    console.log("memberId", memberId);
    const clubUpdated = await model<any>("Clubs", ClubSchema).findOneAndUpdate(
      { _id: clubId, "members.clubMember": memberId },
      {
        $set: { "members.$.confirmed": true },
      }
    );
    return clubUpdated;
  }
);

const ClubModel: any = model<any>("Clubs", ClubSchema);

export default ClubModel;
