import { Router } from "express";
import ApiError from "../../classes/ApiError/ApiError";
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
      members: { $elemMatch: { clubMember: req.params.userId } },
    })
      .populate("films")
      .populate({
        path: "members",
        populate: {
          path: "film",
          select: "Title Poster Year imdbID",
        },
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

      // const members = req.body.clubData.members;
      const members = req.body.clubData.members.filter(
        (member) => member.chooser === false
      );

      const clubId = newClub._id;

      members.forEach((member: any) => {
        (async () => {
          console.log("member !!", member);
          try {
            let accessToken = await AccessToken({ _id: member.clubMember });
            console.log("accessToken", accessToken);
            let link = `https://letterboxdclub-backend.herokuapp.com/${accessToken}/${clubId}`;
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

//add select movie to member
router.put("/:clubId/:memberId", async (req, res) => {
  try {
    console.log("clubbbbID", req.params.clubId);
    console.log("memberIIDDD", req.params.memberId);
    console.log("film id", req.body.filmId);

    const response = await ClubModel.findOneAndUpdate(
      {
        _id: req.params.clubId,
        "members.clubMember": req.params.memberId,
      },
      {
        $set: {
          "members.$.film": req.body.filmId,
          // "members.$.filmSelected": true, TODO use for when chooser selects film
        },
      }
    );
    res.send(response);
  } catch (err) {
    console.log("couldn't modify db");
  }
});

//start watching
router.put("/watch/:clubId/:movieId", async (req, res) => {
  try {
    const response = await ClubModel.findOneAndUpdate(
      {
        _id: req.params.clubId,
      },
      {
        $set: {
          watching: true,
        },
        $addToSet: { films: req.params.movieId },
      }
    );
    res.send(response);
  } catch (err) {
    console.log("couldn't start watching movie");
  }
});

//edit watching
router.put("/editWatch/:clubId/:movieId", async (req, res) => {
  try {
    const response = await ClubModel.findOneAndUpdate(
      {
        _id: req.params.clubId,
      },
      {
        $set: {
          watching: false,
        },
        $pull: { films: req.params.movieId },
      }
    );
    res.send(response);
  } catch (err) {
    console.log("couldn't start watching movie");
  }
});

export default router;
