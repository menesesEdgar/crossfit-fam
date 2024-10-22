import React, { useReducer, useEffect } from 'react';
import AuthContext from "./AuthContext";
import authReducer from "./AuthReducer";
import { useAuthData } from '../hooks/useAuth';

const defaultAuthCtx = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    loading: false,
  }
const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
      user: JSON.parse(localStorage.getItem('user')) || null,
      token: localStorage.getItem('token') || null,
      loading: true,
    });
    const {
        login,
        logout,
        register,
        loadUser,
        updatePassword,
        updateProfile,
        updateProfileImage,
      } = useAuthData(dispatch);
      useEffect(() => {
        const verifyToken = async () => {
          try {
            const token = localStorage.getItem('token');
            if (!token) {
              dispatch({ type: 'AUTH_ERROR' });
              return;
            }
    
            const user = await loadUser();
            if (user) {
              dispatch({ type: 'LOAD_USER', payload: user });
            } else {
              dispatch({ type: 'AUTH_ERROR' });
            }
          } catch (error) {
            dispatch({ type: 'AUTH_ERROR' });
          }
        };
    
        verifyToken();
      }, []);
    return (<AuthContext.Provider
        value={{
          ...state,
          login,
          logout,
          register,
          dispatch,
          updatePassword,
          updateProfile,
          updateProfileImage,
        }}
      >
        {children}
    </AuthContext.Provider>);
}
 
export default AuthProvider;