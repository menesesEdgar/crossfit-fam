import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import NotFound from "../pages/notFound/NotFound";
import Sidebar from "../components/Sidebar/Sidebar";
import { Suspense, useContext } from "react";
import AuthContext from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
// import LoadingModal from '../components/loadingModal/LoadingModal';
import Login from "../pages/login/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import Catalogs from "../pages/catalogs/Catalogs";
import Users from "../pages/users/Users";
import Account from "../pages/account/Account";
import Roles from "../pages/roles/Roles";
import Contest from "../pages/contest/Contest";
import ContestView from "../pages/contest/ContestView";
import ContestProvider from "../context/ContestProvider";
import PublicProvider from "../context/PublicProvider";

// public routes
import PublicContest from "../pages/public/PublicContest";
import PublicLayout from "../Layout/PublicLayout";
import { Vortex } from "react-loader-spinner";

const AppRouter = () => {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Suspense
        fallback={
          <div className="h-full min-h-[100dvh] w-full flex items-center justify-center bg-white/40">
            <Vortex
              visible={true}
              height="80"
              width="80"
              ariaLabel="vortex-loading"
              wrapperStyle={{}}
              wrapperClass="vortex-wrapper"
              colors={["blue", "red", "blue", "red", "red", "blue"]}
            />
          </div>
        }
      >
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
                <Route path="/contest" element={<Contest />} />
                <Route
                  path="/contest/:id"
                  element={
                    <ContestProvider>
                      <ContestView />
                    </ContestProvider>
                  }
                />
                <Route path="/catalogs" element={<Catalogs />} />
                <Route path="/users" element={<Users />} />
                <Route path="/account-settings" element={<Account />} />
                <Route path="/roles" element={<Roles />} />
                <Route
                  path="/login"
                  element={
                    <>
                      <Navigate to={"/"} replace={true} />
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
};

const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="/contest" element={<PublicContest />} />
    </Routes>
  );
};

const UnauthorizedRoute = () => {
  return (
    <Routes>
      <Route
        path="/public/*"
        element={
          <PublicProvider>
            <PublicLayout>
              <PublicRoutes />
            </PublicLayout>
          </PublicProvider>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
export default AppRouter;
