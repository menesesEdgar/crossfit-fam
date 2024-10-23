import { useReducer, useEffect } from 'react';
import RoleReducer from './RoleReducer';
import RoleContext from './RoleContext';
import useRole from '../hooks/useRole';

const RoleProvider = ({ children }) => {
  const [state, dispatch] = useReducer(RoleReducer, {
    roles: [],
    role: null,
  });

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
    useGetRoles();
  }, []);

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
