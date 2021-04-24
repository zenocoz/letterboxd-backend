import { Router } from "express";
import ApiError from "@classes/ApiError/ApiError";
import ClubModel from "./clubs.schema";
const sgMail = require("@sendgrid/mail");
import { AccessToken } from "../../utils/jwt/jwt";
// import Users from "../users/users.schema";
// import MovieModel from "../films/films.schema";

const router = Router();

//get all film clubs with specific user
router.get("/:userId", async (req, res, next) => {
  try {
    const club = await ClubModel.find({
      members: { $elemMatch: { _id: req.params.userId } },
    }).populate("members.film", {
      Runtime: 0,
      Genre: 0,
      Director: 0,
      Writer: 0,
      Actors: 0,
      Plot: 0,
      Language: 0,
      Country: 0,
      imdbID: 0,
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
            // let msg = {
            //   to: member.email,
            //   from: "federico.soncini@gmail.com",
            //   subject: `you have been invited to join the ${req.body.clubData.name} film club`,
            //   text: "click on the link to accept the invitation",
            //   html: `<strong>click on the link to accept the invitation ${link}</strong>`,
            // };
            console.log("link", link);

            // await sgMail.send(msg);
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

//select movie

router.post("/:clubId/:memberId", async (req, res) => {
  try {
    const response = await ClubModel.findOneAndUpdate(
      { _id: req.params.clubId, "members._id": req.params.memberId },
      { $set: { film: req.body.filmId } }
    );

    res.send(response);
  } catch (err) {
    console.log(err);
  }
});

export default router;

// router.post("/suggestMovie", async (req, res, next)=>{

// })
