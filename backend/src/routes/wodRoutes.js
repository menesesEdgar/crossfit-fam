import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createWod,
  deleteWod,
  getWodById,
  getWods,
  updateWod,
} from "../controllers/wodController.js";

const router = express.Router();

router.route("/").get(getWods).post(protect, createWod);
router
  .route("/:id")
  .get(getWodById)
  .put(protect, updateWod)
  .delete(protect, deleteWod);

export default router;
