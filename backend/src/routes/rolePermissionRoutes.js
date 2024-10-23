import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  addPermissionToRole,
  removePermissionFromRole,
  getRolePermissionByRoleId,
  getRolePermissions,
} from "../controllers/rolePermissionController.js";

const router = express.Router();

router.route("/").get(protect, getRolePermissions);

router.route("/role/:roleId").get(protect, getRolePermissionByRoleId);
router.route("/add").post(protect, addPermissionToRole);
router.route("/remove").post(protect, removePermissionFromRole);

export default router;
