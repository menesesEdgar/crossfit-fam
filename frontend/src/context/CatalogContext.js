import { createContext, useContext } from 'react';

const CatalogContext = createContext({
  athletes: [],
  athlete: {},
  categories: [],
  category: {},
  wods: [],
  wod: {},
  contests: [],
  contest: {},
  loading: true,
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
  fetchContests: async () => {},
  fetchContest: async () => {},
  createContest: async () => {},
  updateContest: async () => {},
  deleteContest: async () => {},
});

export const useCatalogContext = () => useContext(CatalogContext);

export default CatalogContext;
