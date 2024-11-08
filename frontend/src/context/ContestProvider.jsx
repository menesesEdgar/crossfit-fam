import { useEffect, useReducer } from "react";
import ContestContext from "./ContestContext";
import contestReducer from "./ContestReducer";
import useContest from "../hooks/useContest";
import { useParams } from "react-router-dom";
const ContestProvider = ({ children }) => {
  const [state, dispatch] = useReducer(contestReducer, {
    contest: {},
    categories: [],
    wods: [],
    athlete: {}
  });
  const { id } = useParams()
  const {
    fetchContest,
    getWodsByCategoryId,
    addCategory,
    deleteCategory,
    addWodToCategory,
    removeWodOfCategory,
    addAllCategories,
    removeAllContestCategories,
    addWod,
    deleteWod,
    addAllWods,
    removeAllContestWods,
    removeAllCategoryWods,
    addAllWodsToCategory,
    addAthleteToContest,
  } = useContest(dispatch);
  useEffect(() => {
    if (id) {
      fetchContest(id);
    }
  }, [id]);

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
        addWodToCategory,
        removeWodOfCategory,
        removeAllCategoryWods,
        addAllWodsToCategory,
        addAthleteToContest,
      }}
    >
      {children}
    </ContestContext.Provider>
  );
};

export default ContestProvider;
