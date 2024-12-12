import React, { useEffect, useState, lazy } from "react";
import { FaUsers } from "react-icons/fa";
import { LiaDumbbellSolid } from "react-icons/lia";
import { BiSolidZap } from "react-icons/bi";
import useCheckPermissions from "../../hooks/useCheckPermissions";
import NotFound from "../notFound/NotFound";
import LoadingModal from "../../components/LoadingModal/LoadingModal";
import { PiMedalFill } from "react-icons/pi";

const Categories = lazy(() => import("./Categories"));
const Wods = lazy(() => import("./Wods"));
const Athletes = lazy(() => import("./Athletes"));

const Catalogs = () => {
  const [activeTab, setActiveTab] = useState(
    parseInt(localStorage.getItem("selectedTab")) || 0
  );

  const isViewCategoriesPermission = useCheckPermissions("view_categories");
  const isViewWodsPermission = useCheckPermissions("view_wods");
  const isViewAthletesPermission = useCheckPermissions("view_athletes");

  const tabContent = [
    {
      id: 0,
      title: "Atletas",
      icon: <FaUsers size={24} />,
      component: <Athletes />,
      permission: isViewAthletesPermission,
    },
    {
      id: 1,
      title: "Categorías",
      icon: <PiMedalFill size={24} />,
      component: <Categories />,
      permission: isViewCategoriesPermission,
    },
    {
      id: 2,
      title: "WODs",
      icon: <BiSolidZap size={24} />,
      component: <Wods />,
      permission: isViewWodsPermission,
    },
  ];

  useEffect(() => {
    localStorage.setItem("selectedTab", activeTab);
  }, [activeTab]);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="grid grid-cols-3 bg-white border-b-2 rounded-lg border-neutral-200 overflow-x-auto">
        {tabContent.map(
          (tab, index) =>
            tab.permission.hasPermission && (
              <button
                key={tab.id}
                className={`flex items-center justify-center rounded-md text-sm md:text-lg gap-2 px-4 py-2 transition duration-200 ${
                  activeTab === index
                    ? "text-white font-semibold bg-crossfit-primary m-1"
                    : "text-neutral-800 hover:text-crossfit-light-pink"
                }`}
                onClick={() => setActiveTab(index)}
              >
                <i>{tab.icon}</i>
                {tab.title}
              </button>
            )
        )}
      </div>

      <div className="relative bg-white rounded-md h-full max-h-[80dvh] md:max-h-[82dvh] shadow-md overflow-hidden mt-4">
        <div className="h-full overflow-auto">
          {tabContent.map((tab, index) => (
            <div
              key={tab.id}
              className={`tab-content flex-1 h-full ${
                activeTab === index ? "active" : "inactive"
              }`}
            >
              {tab.permission.hasPermission ? (
                <React.Suspense fallback={<LoadingModal loading={true} />}>
                  {tab.component}
                </React.Suspense>
              ) : null}
            </div>
          ))}
          {!isViewCategoriesPermission.hasPermission &&
            !isViewWodsPermission.hasPermission &&
            !isViewAthletesPermission.hasPermission && <NotFound />}
        </div>
      </div>
    </div>
  );
};

export default Catalogs;
