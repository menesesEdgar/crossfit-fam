import { useReducer, useEffect } from 'react';
import RoleReducer from './RoleReducer';
import RoleContext from './RoleContext';
import useRole from '../hooks/useRole';
import { useAuthContext } from './AuthContext';

const RoleProvider = ({ children }) => {
  const [state, dispatch] = useReducer(RoleReducer, {
    roles: [],
    role: null,
  });
  const { user, loading } = useAuthContext();
  const {
    useCreateRole,
    useDeleteRole,
    useUpdateRole,
    useGetRoleById,
    useGetRoles,
    useGetRolePermissionByRoleId,
    useGetRolePermissions,
    useCreateRolePermission,
    useDeleteRolePermission,
  } = useRole(dispatch);

  useEffect(() => {
    if (!user || loading) {
      return;
    }
    useGetRoles();
  }, [user]);
  return (
    <RoleContext.Provider
      value={{
        ...state,
        dispatch,
        useCreateRole,
        useDeleteRole,
        useUpdateRole,
        useGetRoleById,
        useGetRoles,
        useGetRolePermissions,
        useGetRolePermissionByRoleId,
        useCreateRolePermission,
        useDeleteRolePermission,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export default RoleProvider;
