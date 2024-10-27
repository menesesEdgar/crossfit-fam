import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createContest,
  deleteContest,
  getContestById,
  getContests,
  updateContest,
  addCategory,
  removeCategory
} from "../controllers/contestController.js";

const router = express.Router();

router.route("/").get(getContests).post(protect, createContest);
router
  .route("/:id")
  .get(getContestById)
  .put(protect, updateContest)
  .delete(protect, deleteContest);
// id for contestId, 
router.route("/:id/:categoryId")
.post(protect, addCategory)
.delete(protect, removeCategory)

export default router;
