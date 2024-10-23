import { createContext, useContext } from 'react';

const PermissionContext = createContext({
  permissions: [],
  permission: null,
  dispatch: () => {},
  useCreatePermission: async () => {},
  useUpdatePermission: async () => {},
  useDeletePermission: async () => {},
  useGetPermissionById: async () => {},
  useGetPermissions: async () => {},
});

export const usePermissionContext = () => useContext(PermissionContext);

export default PermissionContext;
