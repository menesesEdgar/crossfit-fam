import { createContext, useContext } from 'react';

const AuthContext = createContext({
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
  dispatch: () => {},
  updatePassword: async () => {},
  updateProfile: async () => {},
  updateProfileImage: async () => {},
});

export const useAuthContext = () => useContext(AuthContext);

export default AuthContext;
