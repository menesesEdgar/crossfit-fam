import { useEffect, useReducer } from "react";
import ContestContext from "./ContestContext";
import contestReducer from "./ContestReducer";
import useContest from "../hooks/useContest";
const ContestProvider = ({ children }) => {
  const [state, dispatch] = useReducer(contestReducer, {
    contest: {},
    categories: [],
    wods: []
  });
  const {
    fetchContest,
    addCategory,
    deleteCategory,
    deleteWodOfCategory,
    addAllCategories,
    removeAllContestCategories,
    addWod,
    deleteWod,
    addAllWods,
    removeAllContestWods
  } = useContest(dispatch);

  return (
    <ContestContext.Provider
      value={{
        ...state,
        fetchContest,
        addCategory,
        deleteCategory,
        removeAllContestCategories,
        addAllCategories,
        addWod,
        deleteWod,
        addAllWods,
        removeAllContestWods
      }}
    >
      {children}
    </ContestContext.Provider>
  );
};

export default ContestProvider;
