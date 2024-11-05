import express from "express";
import {
  getContestById,
  getPublicContest,
} from "../../controllers/contestController.js";
import { createPendingUser } from "../../controllers/public/publicController.js";

const router = express.Router();

router.route("/").get(getPublicContest);

router.route("/:id").get(getContestById);

router.route("/createPendingUser").post(createPendingUser);

export default router;
