import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
  } from 'react-router-dom';
import NotFound from '../pages/notFound/NotFound';
import Sidebar from '../components/Sidebar/Sidebar';
import { Suspense, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import LoadingModal from '../components/loadingModal/LoadingModal';
import Login from '../pages/login/Login';
import Dashboard from '../pages/dashboard/Dashboard';
  const AppRouter = () => {
    const { user } = useContext(AuthContext);
  
    return (
        <Router>
          <Suspense fallback={<LoadingModal loading={true} />}>
            {user ? <AuthorizedRoute user={user} /> : <UnauthorizedRoute />}
          </Suspense>
        </Router>
    );
  };
  const AuthorizedRoute = ({ user }) => {
    return (
        <Routes>
          <Route
            path="*"
            element={
                <Sidebar>
                    <Routes>
                    <Route element={<ProtectedRoute user={user} />}>
                        <Route path="/" element={<Dashboard />} />
                        <Route
                        path="/login"
                        element={
                            <>
                            <Navigate to={'/'} replace={true} />
                            </>
                        }
                        />
                        <Route path="*" element={<NotFound />} />
                    </Route>
                    </Routes>
                </Sidebar>
            }
          />
        </Routes>
      );
    }
 
const UnauthorizedRoute = () => {
  return (
    <Routes>
      <Route path="*" element={<Login />} />
    </Routes>
  );
};
export default AppRouter;