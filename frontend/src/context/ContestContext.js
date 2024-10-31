import { createContext, useContext } from "react";

const ContestContext = createContext({
  contest: {},
  categories: [],
  wods: [],
  category: {},
  categoryWods: [],
  categoryWod: {},
  addCategory: async () => {},
  deleteCategory: async () => {},
  addWod: async () => {},
  deleteWod: async () => {},
  addCategoryWod: async () => {},
  deleteCategoryWod: async () => {},
  addWodToCategory: async () => {},
  deleteWodOfCategory: async () => {},
  removeAllContestCategories: async () => {},
  addAllCategories: async () => {},
  removeAllContestWods: async () => {},
  addAllWods: async () => {},
});

export const useContestContext = () => useContext(ContestContext);

export default ContestContext;
