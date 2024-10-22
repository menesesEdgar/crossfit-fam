import { createContext, useContext } from 'react';

const CatalogContext = createContext({
  athletes: [],
  athlete: {},
  categories: [],
  category: {},
  wods: [],
  wod: {},
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
});

export const useCatalogContext = () => useContext(CatalogContext);

export default CatalogContext;
