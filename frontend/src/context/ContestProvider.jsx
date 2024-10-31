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
    getWodsByCategoryId,
    addCategory,
    deleteCategory,
    addWodToCategory,
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
        getWodsByCategoryId,
        addCategory,
        deleteCategory,
        removeAllContestCategories,
        addAllCategories,
        addWod,
        deleteWod,
        addAllWods,
        removeAllContestWods,
        addWodToCategory
      }}
    >
      {children}
    </ContestContext.Provider>
  );
};

export default ContestProvider;
