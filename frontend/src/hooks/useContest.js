import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getContest,
  getContests,
  createContest,
  updateContest,
  deleteContest,
  addCategory,
  deleteContestCategory,
} from '../services/api';
import { useLoading } from '../context/LoadingContext';
import Notifies from '../components/Notifies/Notifies';

const useContest = (dispatch) => {
  const queryClient = useQueryClient();
  const { dispatch: loadingDispatch } = useLoading();

  const setLoading = (loading) => {
    loadingDispatch({ type: 'SET_LOADING', payload: loading });
  };


  const fetchContest = useMutation({
    mutationFn: getContest,
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      console.log("FETCH_CONTEST data ", data )
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
      dispatch({ type: 'ADD_CATEGORY', payload: data });
      Notifies('success', 'Categoría agregada correctamente');
    },
    onError: (error) => {
      console.log('error adding category', error);
      Notifies('error', error?.response?.data?.message);
      setLoading(false);
    },
    onSettled: () => {
      queryClient.invalidateQueries('contestsCategories');
      setLoading(false);
    },
  });
  const useDeleteCategory= useMutation({
    mutationFn: deleteContestCategory,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      dispatch({ type: 'DELETE_CATEGORY', payload: data });
      Notifies('success', 'Categoría eliminada correctamente');
    },
    onError: (error) => {
      console.log('error on delete category', error);
      setLoading(false);
    },
    onSettled: () => {
      queryClient.invalidateQueries('contestsCategories');
      setLoading(false);
    },
  });
  return {
    fetchContest: fetchContest.mutate,
    addCategory: (values) => {
      return useAddCategory.mutateAsync(values)
    },
    deleteCategory: (values) => {
      return useDeleteCategory.mutateAsync(values)
    }
  };
};

export default useContest;
