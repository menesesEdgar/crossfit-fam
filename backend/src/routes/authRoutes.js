import express from "express";
import {
  login,
  register,
  loadUser,
  logout,
  updatePassword,
  updateProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/logout", logout);
router.route("/me").get(protect, loadUser);
router.put("/updateProfile", protect, updateProfile);
router.put("/updatePassword", protect, updatePassword);

export default router;
