import { Router } from "express";
import ApiError from "@classes/ApiError/ApiError";
import ClubModel from "./clubs.schema";
const sgMail = require("@sendgrid/mail");

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    console.log(req.body);
    const newClub = await new ClubModel(req.body.clubData).save();
    if (newClub) {
      console.log("new club added to Database", newClub._id);

      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      const members = req.body.clubData.members;

      members.forEach((member: any) => {
        (async () => {
          try {
            let link = `http://localhost:5000/api/clubs/confirm/${member._id}`;
            let msg = {
              to: member.email,
              from: "federico.soncini@gmail.com",
              subject: `you have been invited to join the ${req.body.clubData.name} film club`,
              text: "click on the link to accept the invitation",
              html: `<strong>click on the link to accept the invitation ${link}</strong>`,
            };

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
    next(new ApiError(500, "Couldn't add new review", false));
  }
});

export default router;

//get film club by user id
router.get("/:userId", async (req, res, next) => {
  try {
    console.log(req.params.userId);
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
