import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getContest,
  getContests,
  createContest,
  updateContest,
  deleteContest,
  addCategory,
  addAllCategories,
  deleteContestCategory,
  removeAllContestCategories,
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

  return {
    fetchContest: fetchContest.mutate,
    addCategory: (values) => {
      return useAddCategory.mutateAsync(values);
    },
    deleteCategory: (values) => {
      return useDeleteCategory.mutateAsync(values);
    },
    addAllCategories: (values) => {
      return useAddAllCategories.mutateAsync(values);
    },
    removeAllContestCategories: (values) => {
      return useRemoveAllContestCategories.mutateAsync(values);
    },
  };
};

export default useContest;
