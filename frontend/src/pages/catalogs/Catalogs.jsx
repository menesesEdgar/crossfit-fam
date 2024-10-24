import React, { useEffect, useRef } from "react";
import { Tabs } from "flowbite-react";
import { BiCategory } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";
import useCheckPermissions from "../../hooks/useCheckPermissions";
import NotFound from "../notFound/NotFound";
import { IoIosFitness } from "react-icons/io";
const Categories = React.lazy(() => import("./Categories"));
const Wods = React.lazy(() => import("./Wods"));
const Athletes = React.lazy(() => import("./Athletes"));

const Catalogs = () => {
  const tabsRef = useRef(null);

  useEffect(() => {
    const tab = localStorage.getItem("selectedTab");
    if (tab) {
      tabsRef.current.setActiveTab(parseInt(tab));
    }
  }, []);

  const handleTabChange = (tabIndex) => {
    localStorage.setItem("selectedTab", tabIndex);
  };

  const isViewCategoriesPermission = useCheckPermissions("view_categories");
  const isViewWodsPermission = useCheckPermissions("view_wods");
  const isViewAthletesPermission = useCheckPermissions("view_athletes");

  return (
    <Tabs
      aria-label="Default tabs"
      variant="fullWidth"
      ref={tabsRef}
      onActiveTabChange={(tab) => handleTabChange(tab)}
      className="text-nowrap overflow-x-auto"
    >
      {isViewAthletesPermission.hasPermission && (
        <Tabs.Item title="Atletas" icon={FaUsers}>
          <div className="h-full overflow-hidden">
            <Athletes />
          </div>
        </Tabs.Item>
      )}
      {isViewCategoriesPermission.hasPermission && (
        <Tabs.Item title="Categorías" icon={BiCategory}>
          <div className="h-full overflow-hidden">
            <Categories />
          </div>
        </Tabs.Item>
      )}
      {isViewWodsPermission.hasPermission && (
        <Tabs.Item title="WODs" icon={IoIosFitness}>
          <div className="h-full overflow-hidden">
            <Wods />
          </div>
        </Tabs.Item>
      )}
      {!isViewCategoriesPermission.hasPermission &&
        !isViewWodsPermission.hasPermission &&
        !isViewAthletesPermission && (
          <Tabs.Item title="">
            <NotFound />
          </Tabs.Item>
        )}
    </Tabs>
  );
};

export default Catalogs;
