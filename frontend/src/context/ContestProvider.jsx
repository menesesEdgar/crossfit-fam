import { useReducer } from "react";
import ContestContext from "./ContestContext";
import contestReducer from "./ContestReducer";

const ContestProvider = ({children}) => {
    const [state, dispatch] = useReducer(contestReducer, {
        contests: [],
        contest: {}
    })
    return (
        <ContestContext.Provider value={{
            ...state
        }}>{children}</ContestContext.Provider>
    );
}
 
export default ContestProvider;