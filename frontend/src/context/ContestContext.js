import { createContext, useContext } from 'react';

const ContestContext = createContext({
    contest: {}, 
    categories: [],
    category: {},
    categoryWods: [],
    categoryWod: {},
    fetchContest:  async () => {},
    createContest:  async () => {},
    updateContest:  async () => {},
    deleteContest:  async () => {},
    addCategory:  async () => {},
    deleteCategory:  async () => {},
    addCategoryWod:  async () => {},
    deleteCategoryWod:  async () => {},
});

export const useContestContext = () => useContext(ContestContext);

export default ContestContext;
