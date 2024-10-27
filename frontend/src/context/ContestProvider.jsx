import { useReducer } from "react";
import ContestContext from "./ContestContext";
import contestReducer from "./ContestReducer";
import useContest from "../hooks/useContest";
const ContestProvider = ({children}) => {
    const [state, dispatch] = useReducer(contestReducer, {
        contests: [],
        contest: {}
    })
    const { 
        fetchContest,
        fetchContests,
        createContest,
        updateContest,
        deleteContest,
        addCategory,
        deleteCategory
      } = useContest(dispatch)
    return (
        <ContestContext.Provider value={{
            ...state,
            fetchContest,
            fetchContests,
            createContest,
            updateContest,
            deleteContest,
            addCategory,
            deleteCategory
        }}>{children}</ContestContext.Provider>
    );
}
 
export default ContestProvider;