import { createContext, useContext } from "react";
import { createContest } from "../services/api";

const CatalogContext = createContext({
  athletes: [],
  athlete: {},
  categories: [],
  category: {},
  wods: [],
  wod: {},
  contests: [],
  contest: {},
  publicContests: [],
  publicContest: {},
  loading: true,
  fetchContests: async () => {},
  fetchAthletes: async () => {},
  fetchAthlete: async () => {},
  createAthlete: async () => {},
  updateAthlete: async () => {},
  deleteAthlete: async () => {},
  fetchCategories: async () => {},
  fetchCategory: async () => {},
  createCategory: async () => {},
  updateCategory: async () => {},
  deleteCategory: async () => {},
  fetchWods: async () => {},
  fetchWod: async () => {},
  createWod: async () => {},
  updateWod: async () => {},
  deleteWod: async () => {},
  createContest: async () => {},
  deleteContest: async () => {},
  setContestNextStep: async () => {},
  publicContests: async () => {},
  publicContest: async () => {},
});

export const useCatalogContext = () => useContext(CatalogContext);

export default CatalogContext;
