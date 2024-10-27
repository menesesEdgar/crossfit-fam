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
  const fetchContests = useMutation({
    mutationFn: getContests,
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      dispatch({ type: "FETCH_CONTESTS", payload: data });
    },
    onSettled: () => setLoading(false),
  });

  const fetchContest = useMutation({
    mutationFn: getContest,
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      console.log("FETCH_CONTEST data ", data )
      dispatch({ type: "FETCH_CONTEST", payload: data });
    },
    onSettled: () => setLoading(false),
  });

  const useCreateContest = useMutation({
    mutationFn: createContest,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      dispatch({ type: 'CREATE_CONTEST', payload: data });
      Notifies('success', 'Competencia creada correctamente');
    },
    onError: (error) => {
      console.log('error on createContest', error);
      Notifies('error', error?.response?.data?.message);
      setLoading(false);
    },
    onSettled: () => {
      queryClient.invalidateQueries('contests');
      setLoading(false);
    },
  });

  const useUpdateContest = useMutation({
    mutationFn: updateContest,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      dispatch({ type: 'UPDATE_CONTEST', payload: data });
      Notifies('success', 'Competencia actualizada correctamente');
    },
    onError: (error) => {
      console.log('error on updateContest', error);
      setLoading(false);
    },
    onSettled: () => {
      queryClient.invalidateQueries('contests');
      setLoading(false);
    },
  });


  const useDeleteContest = useMutation({
    mutationFn: deleteContest,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      dispatch({ type: 'DELETE_CONTEST', payload: data });
      Notifies('success', 'Competencia eliminada correctamente');
    },
    onError: (error) => {
      console.log('error on deleteContest', error);
      setLoading(false);
    },
    onSettled: () => {
      queryClient.invalidateQueries('contests');
      setLoading(false);
    },
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
    fetchContests: fetchContests.mutate,
    createContest: (values) => {
      return useCreateContest.mutateAsync(values);
    },
    updateContest: (values) => {
      return useUpdateContest.mutateAsync(values);
    },
    deleteContest: (values) => {
      return useDeleteContest.mutateAsync(values);
    },
    addCategory: (values) => {
      return useAddCategory.mutateAsync(values)
    },
    deleteCategory: (values) => {
      return useDeleteCategory.mutateAsync(values)
    }
  };
};

export default useContest;
