import { model, Schema } from "mongoose";

const ClubSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    members: [
      {
        _id: { type: Schema.Types.ObjectId, ref: "Users" },
        confirmed: {
          type: Schema.Types.Boolean,
          required: true,
        },
        email: { type: String },
      },
    ],
    films: [{ _id: { type: Schema.Types.ObjectId, ref: "Movies" } }],
  },
  { timestamps: true }
);

// ClubSchema.static("acceptInvitation", async function(this,clubId, memberId):any {
//   const clubUpdated = await model<any>("Clubs", ClubSchema).findByIdAndUpdate(clubId, );
//   return clubUpdated
// })

const ClubModel: any = model<any>("Clubs", ClubSchema);

export default ClubModel;

// userSchema.static(
//   "addFollower",
//   async function (this, memberId, userId): Promise<any> {
//     const memberUpdated = await model<IUsers>(
//       "Users",
//       userSchema
//     ).findByIdAndUpdate(memberId, {
//       $addToSet: { followers: { _id: userId } },
//     });
//     return memberUpdated;
//   }
// );
