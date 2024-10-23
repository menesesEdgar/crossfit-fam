import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createPermission,
  getPermissionById,
  getPermissions,
  deletePermission,
  updatePermission,
} from '../services/secure.api';
import { useLoading } from '../context/LoadingContext';
import Notifies from '../components/Notifies/Notifies';

const usePermission = (dispatch) => {
  const queryClient = useQueryClient();
  const { dispatch: loadingDispatch } = useLoading();

  const setLoading = (loading) => {
    loadingDispatch({ type: 'SET_LOADING', payload: loading });
  };

  const useCreatePermission = useMutation({
    mutationFn: createPermission,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      dispatch({ type: 'CREATE_PERMISSION', payload: data });
      Notifies('success', 'Permiso creado correctamente');
    },
    onError: (error) => {
      console.log('error on createPermission', error);
      setLoading(false);
    },
    onSettled: () => {
      queryClient.invalidateQueries('permissions');
      setLoading(false);
    },
  });

  const useUpdatePermission = useMutation({
    mutationFn: updatePermission,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      dispatch({ type: 'UPDATE_PERMISSION', payload: data });
      Notifies('success', 'Permiso actualizado correctamente');
    },
    onError: (error) => {
      console.log('error on updatePermission', error);
      setLoading(false);
    },
    onSettled: () => {
      queryClient.invalidateQueries('permissions');
      setLoading(false);
    },
  });

  const useDeletePermission = useMutation({
    mutationFn: deletePermission,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      dispatch({ type: 'DELETE_PERMISSION', payload: data });
      Notifies('success', 'Permiso eliminado correctamente');
    },
    onError: (error) => {
      console.log('error on deletePermission', error);
      setLoading(false);
    },
    onSettled: () => {
      queryClient.invalidateQueries('permissions');
      setLoading(false);
    },
  });

  const useGetPermissions = useMutation({
    mutationFn: getPermissions,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      dispatch({ type: 'GET_PERMISSIONS', payload: data });
    },
    onError: (error) => {
      console.log('error on getPermissions', error);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const useGetPermissionById = useQueryClient({
    mutationFn: getPermissionById,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      dispatch({ type: 'GET_PERMISSION', payload: data });
    },
    onError: (error) => {
      console.log('error on getPermissionById', error);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  return {
    useCreatePermission: (role) => useCreatePermission.mutateAsync(role),
    useUpdatePermission: (role) => useUpdatePermission.mutateAsync(role),
    useDeletePermission: (role) => useDeletePermission.mutateAsync(role),
    useGetPermissions: () => useGetPermissions.mutateAsync(),
    useGetPermissionById: (id) => useGetPermissionById.mutateAsync(id),
  };
};

export default usePermission;
