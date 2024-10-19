import AuthProvider from "./AuthProvider";
import { BreadcrumbProvider } from "./BreadcrumbContext";
import LoadingProvider from "./LoadingProvider";

  
//   const DataProvider = ({ children }) => (
//     <UserProvider>
//       <VehicleProvider>
//         <CatalogProvider>{children}</CatalogProvider>
//       </VehicleProvider>
//     </UserProvider>
//   );
const AppProvider = ({ children }) => (
    <LoadingProvider>
      <AuthProvider>
        {/* <DataProvider> */}
          <BreadcrumbProvider>{children}</BreadcrumbProvider>
        {/* </DataProvider> */}
      </AuthProvider>
    </LoadingProvider>
  );
  
  export default AppProvider;