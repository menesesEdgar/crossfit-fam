import { useReducer } from "react";
import useUser from "../hooks/useUser";
import PublicReducer from "./PublicReducer";
import PublicContext from "./PublicContext";

const PublicProvider = ({ children }) => {
  const [state, dispatch] = useReducer(PublicReducer, {
    user: null,
  });

  const { useCreatePendingUser } = useUser({ dispatch });

  return (
    <PublicContext.Provider
      value={{
        ...state,
        dispatch,
        useCreatePendingUser,
      }}
    >
      {children}
    </PublicContext.Provider>
  );
};

export default PublicProvider;
