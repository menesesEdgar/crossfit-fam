import { createContext, useContext } from "react";
import { addAthleteToContest } from "../services/api";

const ContestContext = createContext({
  contest: {},
  categories: [],
  wods: [],
  athletes: [],
  athlete: {},
  category: {},
  categoryWods: [], // Wods por categoria
  categoryWod: {}, // No necesario
  fetchContest: async () => {},
  addCategory: async () => {},
  deleteCategory: async () => {},
  addWod: async () => {},
  deleteWod: async () => {},
  addCategoryWod: async () => {},
  deleteCategoryWod: async () => {},
  addWodToCategory: async () => {},
  removeWodOfCategory: async () => {},
  removeAllContestCategories: async () => {},
  addAllCategories: async () => {},
  removeAllContestWods: async () => {},
  addAllWods: async () => {},
  getWodsByCategoryId: async () => {},
  removeAllCategoryWods: async () => {},
  addAllWodsToCategory: async () => {},
  addAthleteToContest: async () => {},
  removeAthleteFromContest: async () => {},
  getRegisteredAthletes: async () => {}
});

export const useContestContext = () => useContext(ContestContext);

export default ContestContext;
