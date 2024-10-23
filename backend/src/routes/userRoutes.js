import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  searchUsers,
  changeUserPassword,
} from "../controllers/userController.js";

const router = express.Router();

router
  .route("/")
  .get(protect, getUsers)
  .post(protect, createUser);
router.route("/search").get(protect, searchUsers);
router
  .route("/:id")
  .get(protect, getUserById)
  .put(protect, updateUser)
  .delete(protect, deleteUser);
router.route("/changePassword/:id").put(protect, changeUserPassword);

export default router;
