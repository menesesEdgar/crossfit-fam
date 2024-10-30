import { useEffect, useReducer } from "react";
import ContestContext from "./ContestContext";
import contestReducer from "./ContestReducer";
import useContest from "../hooks/useContest";
const ContestProvider = ({children}) => {

    const [state, dispatch] = useReducer(contestReducer, {
        contest: {}
    })
    const { 
        fetchContest,
        addCategory,
        deleteCategory,
        deleteWodOfCategory,
      } = useContest(dispatch)

    return (
        <ContestContext.Provider value={{
            ...state,
            fetchContest,
            addCategory,
            deleteCategory
        }}>{children}</ContestContext.Provider>
    );
}
 
export default ContestProvider;