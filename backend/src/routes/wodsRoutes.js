import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  createCategory,
} from "../controllers/categoriesController.js";

const router = express.Router();

router
  .route("/")
  .get(protect, getCategories)
  .post(
    protect,
    createCategory
  );
router
  .route("/:id")
  .get(protect, getCategoryById)
  .put(
    protect,
    updateCategory
  )
  .delete(protect, deleteCategory);

export default router;
