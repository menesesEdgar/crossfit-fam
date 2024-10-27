import { createContext, useContext } from 'react';

const ContestContext = createContext({
    contests: [],
    contest: {}, 
    categories: [],
    category: [],
    categoryWods: [],
    categoryWod: {},
    fetchContests:  async () => {},
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
