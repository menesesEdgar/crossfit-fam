import React, { useReducer, useEffect } from 'react';
import LoadingContext from './LoadingContext';
import loadingReducer from './LoadingReducer';
import LoadingModal from '../components/loadingModal/LoadingModal';

const LoadingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(loadingReducer, {
    loading: false,
  });

  useEffect(() => {
    if (state.loading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [state.loading]);

  return (
    <LoadingContext.Provider value={{ ...state, dispatch }}>
      {children}
      <LoadingModal loading={state.loading} />
    </LoadingContext.Provider>
  );
};

export default LoadingProvider;
