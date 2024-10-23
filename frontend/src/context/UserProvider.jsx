import { useReducer } from 'react';
import UserReducer from './UserReducer';
import UserContext from './UserContext';
import useUser from '../hooks/useUser';

const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(UserReducer, {
    users: [],
    user: null,
  });

  const { useCreateUser, useDeleteUser, useUpdateUser, useChangePasswordUser } =
    useUser({ dispatch });

  return (
    <UserContext.Provider
      value={{
        ...state,
        dispatch,
        useCreateUser,
        useDeleteUser,
        useUpdateUser,
        useChangePasswordUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
