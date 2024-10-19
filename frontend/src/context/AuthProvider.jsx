import AuthContext from "./AuthContext";
import authReducer from "./AuthReducer";
const defaultAuthCtx = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    loading: false,
  }
const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, defaultAuthCtx);

    const updatedCtx = {
        ...state
    }
    return (<AuthContext.Provider value={updatedCtx}>
        {children}
    </AuthContext.Provider>);
}
 
export default AuthProvider;