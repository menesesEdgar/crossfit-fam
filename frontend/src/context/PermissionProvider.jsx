import { useReducer } from 'react';
import PermissionReducer from './PermissionReducer';
import PermissionContext from './PermissionContext';
import usePermission from '../hooks/usePermission';

const PermissionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(PermissionReducer, {
    permissions: [],
    permission: null,
  });

  const {
    useCreatePermission,
    useDeletePermission,
    useUpdatePermission,
    useGetPermissionById,
    useGetPermissions,
  } = usePermission(dispatch);

  return (
    <PermissionContext.Provider
      value={{
        ...state,
        dispatch,
        useCreatePermission,
        useDeletePermission,
        useUpdatePermission,
        useGetPermissionById,
        useGetPermissions,
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
};

export default PermissionProvider;
