import { createContext, useContext } from "react";

const PublicContext = createContext({
  user: null,
  dispatch: () => {},
  useCreatePendingUser: async () => {},
});

export const usePublicContext = () => useContext(PublicContext);

export default PublicContext;
