import AuthProvider from "./AuthProvider";
import { BreadcrumbProvider } from "./BreadcrumbContext";
import CatalogProvider from "./CatalogProvider";
import LoadingProvider from "./LoadingProvider";
import PermissionProvider from "./PermissionProvider";
import RoleProvider from "./RoleProvider";
import UserProvider from "./UserProvider";
const SecurityProvider = ({ children }) => (
  <AuthProvider>
    <RoleProvider>
      <PermissionProvider>{children}</PermissionProvider>
    </RoleProvider>
  </AuthProvider>
);
  const DataProvider = ({ children }) => (
    <UserProvider>
        <CatalogProvider>{children}</CatalogProvider>
    </UserProvider>
  );
const AppProvider = ({ children }) => (
    <LoadingProvider>
      <SecurityProvider>
        <DataProvider>
            <BreadcrumbProvider>{children}</BreadcrumbProvider>
        </DataProvider>
      </SecurityProvider>
    </LoadingProvider>
  );
  
  export default AppProvider;