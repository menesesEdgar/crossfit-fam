import { useReducer, useEffect } from "react";
import { useAuthContext } from "./AuthContext";
import CatalogContext from "./CatalogContext";
import CatalogReducer from "./CatalogReducer";
import useCatalogs from "../hooks/useCatalogs";
import useContest from "../hooks/useContest";

const CatalogProvider = ({ children }) => {
  const [state, dispatch] = useReducer(CatalogReducer, {
    athletes: [],
    athlete: {},
    categories: [],
    category: {},
    wods: [],
    wod: {},
    contests: [],
    contest: {},
    loading: true,
  });

  const { user, loading } = useAuthContext();

  const {
    createAthlete,
    createCategory,
    createWod,
    deleteAthlete,
    deleteCategory,
    deleteWod,
    fetchAthlete,
    fetchAthletes,
    fetchCategories,
    fetchCategory,
    fetchWod,
    fetchWods,
    updateAthlete,
    updateCategory,
    updateWod,
    fetchContests,
    createContest,
    deleteContest,
    updateContest
  } = useCatalogs(dispatch);
  const loadCatalogsData = () => {
    // fetchAthlete(); Al usar este metodo se extraen sin filtro todos los atletas y usuarios de la base de datos, es de corregir este error (RBM)
    fetchContests()
    fetchCategories();
    fetchWods();
  };

  useEffect(() => {
    if (!user || loading) {
      return;
    }
    loadCatalogsData();
  }, [user]);

  return (
    <CatalogContext.Provider
      value={{
        ...state,
        fetchAthletes,
        fetchAthlete,
        createAthlete,
        updateAthlete,
        deleteAthlete,
        fetchCategories,
        fetchCategory,
        createCategory,
        updateCategory,
        deleteCategory,
        fetchWods,
        fetchWod,
        createWod,
        updateWod,
        deleteWod,
        fetchContests,
        createContest,
        updateContest,
        deleteContest
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
};

export default CatalogProvider;
