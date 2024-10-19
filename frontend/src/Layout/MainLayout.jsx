import React, { useEffect } from 'react';
import { useBreadcrumb } from '../context/BreadcrumbContext';
import Breadcrumbs from '../components/Breadcrum/Breadcrumb';
import BreadcrumbsBuilder from '../utils/BreadcrumbsBuilder';
import { useLocation } from 'react-router-dom';

const MainLayout = ({ children }) => {
  const { breadcrumb, setBreadcrumb } = useBreadcrumb();
  const location = useLocation();

  useEffect(() => {
    const newBreadcrumb = BreadcrumbsBuilder(location.pathname);
    setBreadcrumb(newBreadcrumb);
  }, [location]);

  return (
    <div className="flex flex-col flex-1 h-full bg-mycad-gray p-4 overflow-y-auto overflow-x-hidden">
      <Breadcrumbs breadcrumbs={breadcrumb} />
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default MainLayout;
