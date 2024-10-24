import { createContext, useContext } from 'react';

const ContestContext = createContext({
    contests: [],
    contest: {}, 
    fetchContests:  async () => {},
    fetchContest:  async () => {},
    createContest:  async () => {},
    updateContest:  async () => {},
    deleteContest:  async () => {},
});

export const useContest = () => useContext(ContestContext);

export default ContestContext;
