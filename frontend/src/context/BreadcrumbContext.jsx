import React, { createContext, useState, useContext } from 'react';

const BreadcrumbContext = createContext({
  breadcrumb: [],
  setBreadcrumb: () => {},
});

export const useBreadcrumb = () => {
  return useContext(BreadcrumbContext);
};

export const BreadcrumbProvider = ({ children }) => {
  const [breadcrumb, setBreadcrumb] = useState([]);

  return (
    <BreadcrumbContext.Provider value={{ breadcrumb, setBreadcrumb }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};
