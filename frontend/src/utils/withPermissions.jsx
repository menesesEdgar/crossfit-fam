import React, { useMemo } from 'react';
import { useAuthContext } from '../context/AuthContext';
import NotFound from '../pages/notFound/NotFound';

const withPermission = (WrappedComponent, requiredPermission) => {
  return (props) => {
    const { user, loading } = useAuthContext();
    const { authPermissions } = user;

    const userPermissions = useMemo(() => {
      return authPermissions;
    }, [authPermissions]);
    const hasPermission = userPermissions?.includes(requiredPermission);

    if (loading) {
      return null;
    }

    if (!hasPermission) {
      return <NotFound />;
    }
    return <WrappedComponent {...props} />;
  };
};

export default withPermission;
