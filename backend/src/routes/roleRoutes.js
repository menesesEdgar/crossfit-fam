import express from "express";
import {
  createRole,
  deleteRole,
  getRoleById,
  getRoles,
  updateRole,
} from "../controllers/roleController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getRoles).post(protect, createRole);
router
  .route("/:id")
  .get(protect, getRoleById)
  .put(protect, updateRole)
  .delete(protect, deleteRole);

export default router;
