import { createContext, useContext } from 'react';

const ContestContext = createContext({
    contest: {}, 
    categories: [],
    category: {},
    categoryWods: [],
    categoryWod: {},
    addCategory:  async () => {},
    deleteCategory:  async () => {},
    addCategoryWod:  async () => {},
    deleteCategoryWod:  async () => {},
    addWodToCategory:  async () => {},
    deleteWodOfCategory:  async () => {},
});

export const useContestContext = () => useContext(ContestContext);

export default ContestContext;
