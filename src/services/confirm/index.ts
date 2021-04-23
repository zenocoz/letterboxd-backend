import { Router } from "express";
const router = Router();
import Users from "../users/users.schema";
import ClubModel from "../clubs/clubs.schema";
import { verifyJWT } from "../../utils/jwt/jwt";

router.get("/:accessToken/:clubId", async (req, res) => {
  try {
    const token = req.params.accessToken;
    const decoded: any = await verifyJWT(token, process.env.JWT_ACCESS_SECRET);
    const user = await Users.findOne({ _id: decoded._id });
    if (!user) throw new Error();
    ClubModel.acceptInvitation(req.params.clubId, decoded._id);
    res.send({ userAuthenticated: user._id });
  } catch (error) {
    console.log(error);
  }
});

export default router;
