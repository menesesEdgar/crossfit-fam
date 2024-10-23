import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createUser,
  updateUser,
  deleteUser,
  changePasswordUser,
} from '../services/api';
import { useLoading } from '../context/LoadingContext';
import Notifies from '../components/Notifies/Notifies';

const useUser = ({ dispatch }) => {
  const queryClient = useQueryClient();
  const { dispatch: loadingDispatch } = useLoading();

  const setLoading = (loading) => {
    loadingDispatch({ type: 'SET_LOADING', payload: loading });
  };

  const useCreateUser = useMutation({
    mutationFn: createUser,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      dispatch({ type: 'CREATE_USER', payload: data });
      Notifies('success', 'Usuario creado correctamente');
    },
    onError: (error) => {
      console.log('error on createUser', error);
      Notifies('error', error?.response?.data?.message);
      setLoading(false);
    },
    onSettled: () => {
      queryClient.invalidateQueries('users');
      setLoading(false);
    },
  });

  const useUpdateUser = useMutation({
    mutationFn: updateUser,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      dispatch({ type: 'UPDATE_USER', payload: data });
      Notifies('success', 'Usuario actualizado correctamente');
    },
    onError: (error) => {
      console.log('error on updateUser', error);
      setLoading(false);
    },
    onSettled: () => {
      queryClient.invalidateQueries('users');
      setLoading(false);
    },
  });

  const useChangePasswordUser = useMutation({
    mutationFn: changePasswordUser,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      Notifies('success', 'Contraseña actualizada correctamente');
    },
    onError: (error) => {
      console.log('error on changePasswordUser', error);
      setLoading(false);
    },
    onSettled: () => {
      queryClient.invalidateQueries('users');
      setLoading(false);
    },
  });

  const useDeleteUser = useMutation({
    mutationFn: deleteUser,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      dispatch({ type: 'DELETE_USER', payload: data });
      Notifies('success', 'Usuario eliminado correctamente');
    },
    onError: (error) => {
      console.log('error on deleteUser', error);
      setLoading(false);
    },
    onSettled: () => {
      queryClient.invalidateQueries('users');
      setLoading(false);
    },
  });

  return {
    useCreateUser: (values) => {
      return useCreateUser.mutateAsync(values);
    },
    useUpdateUser: (values) => {
      return useUpdateUser.mutateAsync(values);
    },
    useDeleteUser: (values) => {
      return useDeleteUser.mutateAsync(values);
    },
    useChangePasswordUser: (values) => {
      return useChangePasswordUser.mutateAsync(values);
    },
  };
};

export default useUser;
