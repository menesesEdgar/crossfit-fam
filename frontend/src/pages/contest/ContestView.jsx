import React, { useEffect, useState, lazy } from "react";
import { LiaDumbbellSolid } from "react-icons/lia";
import { BiSolidZap, BiCategory } from "react-icons/bi";
import { GiBiceps } from "react-icons/gi";
import useCheckPermissions from "../../hooks/useCheckPermissions";
import NotFound from "../notFound/NotFound";
import LoadingModal from "../../components/LoadingModal/LoadingModal";
import withPermission from "../../utils/withPermissions";

const ContestCategories = lazy(() => import("./Details/ContestCategories"));
const CategoryWods = lazy(() => import("./Details/CategoryWods"));
const CategorieAthletes = lazy(() => import("./Details/CategorieAthletes"));
const ContestWods = lazy(() => import("./Details/ContestWods"));

const ContestView = () => {
  const [activeTab, setActiveTab] = useState(
    parseInt(localStorage.getItem("selectedContestTab")) || 0
  );

  const isViewContestCategoriesPermission = useCheckPermissions("view_contest");
  const isViewCategorieWodsPermission = useCheckPermissions("view_contest");
  const isViewCategorieAthletesPermission = useCheckPermissions("view_contest");
  const isViewContestWodsPermission = useCheckPermissions("view_contest");

  const tabContent = [
    {
      id: 0,
      title: "Categorías",
      icon: <BiCategory size={24} />,
      component: <ContestCategories />,
      permission: isViewContestCategoriesPermission,
    },
    {
      id: 1,
      title: "WODs",
      icon: <LiaDumbbellSolid size={24} />,
      component: <ContestWods />,
      permission: isViewContestWodsPermission,
    },
    {
      id: 2,
      title: "WOD por categoría",
      icon: <BiSolidZap size={24} />,
      component: <CategoryWods />,
      permission: isViewCategorieWodsPermission,
    },
    {
      id: 3,
      title: "Atletas",
      icon: <GiBiceps size={24} />,
      component: <CategorieAthletes />,
      permission: isViewCategorieAthletesPermission,
    },
  ];

  useEffect(() => {
    localStorage.setItem("selectedContestTab", activeTab);
  }, [activeTab]);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="grid grid-cols-4 bg-white border-b-2 rounded-lg border-neutral-200 overflow-x-auto">
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

      <div className="relative bg-white rounded-md h-full max-h-[78dvh] md:max-h-[82dvh] shadow-md overflow-hidden mt-4">
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
          {!isViewContestCategoriesPermission.hasPermission &&
            !isViewCategorieWodsPermission.hasPermission &&
            !isViewCategorieAthletesPermission && <NotFound />}
        </div>
      </div>
    </div>
  );
};

const ProtectedContestView = withPermission(ContestView, "view_contest");

export default ProtectedContestView;
