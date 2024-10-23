import { createContext, useContext } from 'react';

const RoleContext = createContext({
  roles: [],
  role: null,
  rolePermissions: [],
  rolePermission: null,
  dispatch: () => {},
  useCreateRole: async () => {},
  useDeleteRole: async () => {},
  useUpdateRole: async () => {},
  useGetRoleById: async () => {},
  useGetRoles: async () => {},
  useGetRolePermissions: async () => {},
  useGetRolePermissionByRoleId: async () => {},
  useCreateRolePermission: async () => {},
  useDeleteRolePermission: async () => {},
});

export const useRoleContext = () => useContext(RoleContext);

export default RoleContext;
