import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createContest,
  deleteContest,
  getContestById,
  getContests,
  updateContest,
  setContextNextStep,
  addCategory,
  removeCategory,
  addAllCategoriesToContest,
  removeAllCategoriesFromContest,
  addWod,
  removeWod,
  addAllWodsToContest,
  removeAllWodsFromContest,
  addWodToCategory,
  removeWodToCategory,
  getWodsByCategory,
  addAllCategoryWods,
  removeAllWodsFromCategory,
  addAthleteToContest,
  removeAthleteFromContest,
  fetchRegisteredAthletes,
} from "../controllers/contestController.js";

const router = express.Router();

router
  .route("/athlete")
  .post(protect, addAthleteToContest)
  .get(fetchRegisteredAthletes);
router.route("/athlete/:id").delete(protect, removeAthleteFromContest);
router.route("/").get(getContests).post(protect, createContest);
router
  .route("/:id")
  .get(getContestById)
  .put(protect, updateContest)
  .delete(protect, deleteContest);
router.route("/:id/nextStep").put(protect, setContextNextStep);
router
  .route("/:id/:categoryId")
  .post(protect, addCategory)
  .delete(protect, removeCategory);
router.route("/:id/addAllCategories").put(protect, addAllCategoriesToContest);
router
  .route("/:id/removeAllCategories")
  .put(protect, removeAllCategoriesFromContest);
// Contest Wods
router
  .route("/:id/wod/:wodId")
  .post(protect, addWod)
  .delete(protect, removeWod);
router.route("/:id/addAllwods").put(protect, addAllWodsToContest);
router.route("/:id/removeAllWods").put(protect, removeAllWodsFromContest);

router
  .route("/category/:categoryId/wod/:wodId")
  .post(protect, addWodToCategory)
  .delete(protect, removeWodToCategory);
router.route("/category/wods/:categoryId").get(getWodsByCategory);
router
  .route("/:contestId/category/:categoryId/addAllWods")
  .put(protect, addAllCategoryWods);
router
  .route("/category/:categoryId/removeAllWods")
  .put(protect, removeAllWodsFromCategory);

export default router;
