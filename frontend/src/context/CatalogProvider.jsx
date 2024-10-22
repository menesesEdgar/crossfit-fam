import { useReducer, useEffect } from 'react';
import { useAuthContext } from './AuthContext';
import CatalogContext from './CatalogContext';
import CatalogReducer from './CatalogReducer';
import useCatalogs from '../hooks/useCatalogs';

const CatalogProvider = ({ children }) => {
  const [state, dispatch] = useReducer(CatalogReducer, {
    athletes: [],
    athlete: {},
    categories: [],
    category: {},
    wods: [],
    wod: {},
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
    updateWod
  } = useCatalogs(dispatch);

  const loadCatalogsData = () => {
    fetchAthlete();
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
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
};

export default CatalogProvider;
