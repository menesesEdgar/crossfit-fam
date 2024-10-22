import { useMemo } from 'react';
import { useAuthContext } from '../context/AuthContext';

const useCheckPermissions = (requiredPermission) => {
  const { user, loading } = useAuthContext();
  const { authPermissions = [] } = user || {};

  const hasPermission = useMemo(() => {
    return authPermissions.includes(requiredPermission);
  }, [authPermissions, requiredPermission]);

  return {
    hasPermission,
    loading,
  };
};

export default useCheckPermissions;
