import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getContest,
  addCategory,
  addAllCategories,
  deleteContestCategory,
  removeAllContestCategories,
  addWod,
  deleteContestWod,
  addAllWods,
  removeAllContestWods,
  getWodsByCategory,
  addWodToCategory
} from "../services/api";
import { useLoading } from "../context/LoadingContext";
import Notifies from "../components/Notifies/Notifies";

const useContest = (dispatch) => {
  const queryClient = useQueryClient();
  const { dispatch: loadingDispatch } = useLoading();

  const setLoading = (loading) => {
    loadingDispatch({ type: "SET_LOADING", payload: loading });
  };

  const fetchContest = useMutation({
    mutationFn: getContest,
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      dispatch({ type: "FETCH_CONTEST", payload: data });
    },
    onSettled: () => setLoading(false),
  });
  const getWodsByCategoryId = useMutation({
    mutationFn: getWodsByCategory,
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      dispatch({ type: "FETCH_WODS_BY_CATEGORY", payload: data });
    },
    onSettled: () => setLoading(false),
  });

  // Contest Categories
  const useAddCategory = useMutation({
    mutationFn: addCategory,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      dispatch({ type: "ADD_CATEGORY", payload: data });
      Notifies("success", "Categoría agregada correctamente");
    },
    onError: (error) => {
      console.log("error adding category", error);
      Notifies("error", error?.response?.data?.message);
      setLoading(false);
    },
    onSettled: () => {
      queryClient.invalidateQueries("contestsCategories");
      setLoading(false);
    },
  });
  const useDeleteCategory = useMutation({
    mutationFn: deleteContestCategory,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      dispatch({ type: "DELETE_CATEGORY", payload: data });
      Notifies("success", "Categoría eliminada correctamente");
    },
    onError: (error) => {
      console.log("error on delete category", error);
      setLoading(false);
    },
    onSettled: () => {
      queryClient.invalidateQueries("contestsCategories");
      setLoading(false);
    },
  });

  const useAddAllCategories = useMutation({
    mutationFn: addAllCategories,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      dispatch({ type: "ADD_ALL_CATEGORIES", payload: data?.data });
      Notifies("success", "Categorías agregadas correctamente");
    },
    onError: (error) => {
      console.log("error adding all categories", error);
      Notifies("error", error?.response?.data?.message);
      setLoading(false);
    },
    onSettled: () => {
      queryClient.invalidateQueries("contestsCategories");
      setLoading(false);
    },
  });

  const useRemoveAllContestCategories = useMutation({
    mutationFn: removeAllContestCategories,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      dispatch({ type: "REMOVE_ALL_CATEGORIES", payload: data });
      Notifies("success", "Categorías eliminadas correctamente");
    },
    onError: (error) => {
      console.log("error removing all categories", error);
      Notifies("error", error?.response?.data?.message);
      setLoading(false);
    },
    onSettled: () => {
      queryClient.invalidateQueries("contestsCategories");
      setLoading(false);
    },
  });
// Contest Wods
const useAddWod= useMutation({
  mutationFn: addWod,
  onMutate: () => {
    setLoading(true);
  },
  onSuccess: (data) => {
    dispatch({ type: "ADD_WOD", payload: data });
    Notifies("success", "Wod agregado correctamente");
  },
  onError: (error) => {
    console.log("error adding wod", error);
    Notifies("error", error?.response?.data?.message);
    setLoading(false);
  },
  onSettled: () => {
    queryClient.invalidateQueries("contestsWods");
    setLoading(false);
  },
});
const useDeleteWod= useMutation({
  mutationFn: deleteContestWod,
  onMutate: () => {
    setLoading(true);
  },
  onSuccess: (data) => {
    dispatch({ type: "DELETE_WOD", payload: data });
    Notifies("success", "Wod eliminado correctamente");
  },
  onError: (error) => {
    console.log("error on delete wod", error);
    setLoading(false);
  },
  onSettled: () => {
    queryClient.invalidateQueries("contestsWods");
    setLoading(false);
  },
});

const useAddAllWods = useMutation({
  mutationFn: addAllWods,
  onMutate: () => {
    setLoading(true);
  },
  onSuccess: (data) => {
    dispatch({ type: "ADD_ALL_WODS", payload: data?.data });
    Notifies("success", "Wods agregados correctamente");
  },
  onError: (error) => {
    console.log("error adding all wods", error);
    Notifies("error", error?.response?.data?.message);
    setLoading(false);
  },
  onSettled: () => {
    queryClient.invalidateQueries("contestsWods");
    setLoading(false);
  },
});

const useRemoveAllContestWods= useMutation({
  mutationFn: removeAllContestWods,
  onMutate: () => {
    setLoading(true);
  },
  onSuccess: (data) => {
    dispatch({ type: "REMOVE_ALL_WODS", payload: data });
    Notifies("success", "Wods eliminados correctamente");
  },
  onError: (error) => {
    console.log("error removing all wods", error);
    Notifies("error", error?.response?.data?.message);
    setLoading(false);
  },
  onSettled: () => {
    queryClient.invalidateQueries("contestsWods");
    setLoading(false);
  },
});
const useAddWodToCategory= useMutation({
  mutationFn: addWodToCategory,
  onMutate: () => {
    setLoading(true);
  },
  onSuccess: (data) => {
    dispatch({ type: "ADD_WOD_TO_CATEGORY", payload: data });
    Notifies("success", "Wod agregado correctamente");
  },
  onError: (error) => {
    console.log("error adding wod", error);
    Notifies("error", error?.response?.data?.message);
    setLoading(false);
  },
  onSettled: () => {
    queryClient.invalidateQueries("categoryWods");
    setLoading(false);
  },
});
  return {
    fetchContest: fetchContest.mutate,
    getWodsByCategoryId: getWodsByCategoryId.mutate,
    addCategory: (values) => {
      return useAddCategory.mutateAsync(values);
    },
    deleteCategory: (values) => {
      return useDeleteCategory.mutateAsync(values);
    },
    addWod: (values) => {
      return useAddWod.mutateAsync(values);
    },
    addWodToCategory: (values) => {
      return useAddWodToCategory.mutateAsync(values);
    },
    deleteWod: (values) => {
      return useDeleteWod.mutateAsync(values);
    },
    addAllCategories: (values) => {
      return useAddAllCategories.mutateAsync(values);
    },
    removeAllContestCategories: (values) => {
      return useRemoveAllContestCategories.mutateAsync(values);
    },
    addAllWods: (values) => {
      return useAddAllWods.mutateAsync(values);
    },
    removeAllContestWods: (values) => {
      return useRemoveAllContestWods.mutateAsync(values);
    },
  };
};

export default useContest;
