import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.route("/").get(getCategories).post(protect, createCategory);
router
  .route("/:id")
  .get(getCategoryById)
  .put(protect, updateCategory)
  .delete(protect, deleteCategory);

export default router;
