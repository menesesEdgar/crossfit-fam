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
    athlete: {},
    athletes: [],
    categoryWods: [],
    loading: true,
  });
  const { id } = useParams()
  const {
    fetchContest,
    getWodsByCategoryId,
    fetchAthletesByCategory,
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
    removeAthleteFromContest,
    addScoreToAthlete,
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
        fetchAthletesByCategory,
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
        removeAthleteFromContest,
        addScoreToAthlete,

      }}
    >
      {children}
    </ContestContext.Provider>
  );
};

export default ContestProvider;
