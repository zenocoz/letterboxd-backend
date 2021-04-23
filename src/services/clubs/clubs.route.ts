import { Router } from "express";
import ApiError from "@classes/ApiError/ApiError";
import ClubModel from "./clubs.schema";
const sgMail = require("@sendgrid/mail");
import { AccessToken } from "../../utils/jwt/jwt";
// import Users from "../users/users.schema";

const router = Router();

//get film clubs by user id
router.get("/:userId", async (req, res, next) => {
  try {
    const club = await ClubModel.find({
      members: { $elemMatch: { _id: req.params.userId } },
    });
    if (club) {
      res.send(club);
    } else {
      console.log("problems finding the club");
    }
  } catch (err) {
    console.log(err);
    next(new ApiError(500, "Couldn't find club by user id", false));
  }
});

router.post("/", async (req, res, next) => {
  try {
    console.log(req.body.clubData);
    const newClub = await new ClubModel(req.body.clubData).save();
    if (newClub) {
      console.log("new club added to Database", newClub._id);

      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      const members = req.body.clubData.members;
      const clubId = newClub._id;

      members.forEach((member: any) => {
        (async () => {
          try {
            let accessToken = await AccessToken({ _id: member._id });
            let link = `http://localhost:5000/confirm/${accessToken}/${clubId}`;
            let msg = {
              to: member.email,
              from: "federico.soncini@gmail.com",
              subject: `you have been invited to join the ${req.body.clubData.name} film club`,
              text: "click on the link to accept the invitation",
              html: `<strong>click on the link to accept the invitation ${link}</strong>`,
            };
            console.log("link", link);

            await sgMail.send(msg);
          } catch (err) {
            console.log("THESE ERRORS OCCURRED", err);
          }
        })();
      });
      res.send({ _id: newClub._id });
    } else {
      console.log("couldn't add newClub to Database");
    }
  } catch (err) {
    console.log(err);
    next(new ApiError(500, "Couldn't add new Club", false));
  }
});

//accept invitation
// router.get("/confirm/:accessToken/:clubId", async (req, res) => {
//   try {
//     const token = req.params.accessToken;
//     console.log("token", token);
//     const decoded: any = await verifyJWT(token, process.env.JWT_ACCESS_SECRET);
//     console.log("deconded", decoded);
//     const user = await Users.findOne({ _id: decoded._id });
//     if (!user) throw new Error();
//     ClubModel.acceptInvitation(req.params.clubId, decoded._id);
//     res.send({ userAuthenticated: user._id });
//   } catch (error) {
//     console.log(error);
//   }
// });

// router.get("/memberStatus/:clubId/:memberId", async (req, res) => {
//   try {
//     const response = await ClubModel.findOne(
//       { _id: req.params.clubId, "members._id": req.params.memberId },
//       { "members.$": 1 }
//     );
//     res.send(response);
//   } catch (err) {
//     console.log(err);
//   }
// });

export default router;

// router.post("/suggestMovie", async (req, res, next)=>{

// })
