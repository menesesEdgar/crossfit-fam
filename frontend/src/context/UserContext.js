import { createContext, useContext } from 'react';

const UserContext = createContext({
  users: [],
  user: null,
  dispatch: () => {},
  useCreateUser: async () => {},
  useUpdateUser: async () => {},
  useDeleteUser: async () => {},
  useChangePasswordUser: async () => {},
});

export const useUserContext = () => useContext(UserContext);

export default UserContext;
