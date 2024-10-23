import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createContest,
  deleteContest,
  getContestById,
  getContests,
  updateContest,
} from "../controllers/contestController.js";

const router = express.Router();

router.route("/").get(getContests).post(protect, createContest);
router
  .route("/:id")
  .get(getContestById)
  .put(protect, updateContest)
  .delete(protect, deleteContest);

export default router;
