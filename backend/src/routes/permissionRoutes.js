import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createPermission,
  deletePermission,
  getPermissionById,
  getPermissions,
  updatePermission,
} from "../controllers/permissionController.js";

const router = express.Router();

router.route("/").get(protect, getPermissions).post(protect, createPermission);
router
  .route("/:id")
  .get(protect, getPermissionById)
  .put(protect, updatePermission)
  .delete(protect, deletePermission);

export default router;
