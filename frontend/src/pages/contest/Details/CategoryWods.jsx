import TableHeader from "../../../components/Table/TableHeader";
import { FaChevronRight, FaUserShield } from "react-icons/fa";
import useCheckPermissions from "../../../hooks/useCheckPermissions";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { LiaDumbbellSolid } from "react-icons/lia";
import { useContestContext } from "../../../context/ContestContext";
import { TextInput } from "flowbite-react";
const CategoryWods = ({ setActiveTab }) => {
  // ContestId
  const {
    categories: contestCategories,
    wods: contestWods,
    categoryWods,
    addWodToCategory,
    removeWodOfCategory,
    getWodsByCategoryId,
  } = useContestContext();
  const [isDisabled, setIsDisabled] = useState(false);
  // console.log("categoryWods ", categoryWods);
  const [activeCategory, setActiveCategory] = useState(
    contestCategories?.length > 0 ? contestCategories[0]?.conCatId : null
  );
  const updateWodOfCategory = async (wod, isChecked) => {
    // console.log("wod ", wod);
    // console.log("activeCategory ", activeCategory);

    setIsDisabled(true);
    if (isChecked) {
      await addWodToCategory({
        categoryId: activeCategory,
        wodId: wod.conWodId,
      });
    } else {
      const id = categoryWods?.find(
        (category) => category.contestWodId === wod.conWodId
      ).id;
      await removeWodOfCategory({
        categoryId: activeCategory,
        categoryWodId: id,
      });
    }
    setTimeout(() => {
      setIsDisabled(false);
    }, 1000);
  };
  const changeActiveCategory = (tab) => {
    setActiveCategory(tab?.conCatId);
    getWodsByCategory(tab?.conCatId);
  };
  useEffect(() => {
    if (contestCategories.length > 0 && activeCategory) {
      getWodsByCategoryId(activeCategory);
    }
  }, [activeCategory]);
  const getWodsByCategory = async (categoryId) => {
    await getWodsByCategoryId(categoryId);
  };
  // console.log("contestCategories ", contestCategories);
  // console.log("contestWods ", contestWods);
  // Contest Wods with the conWodId need to be found with the contestWodId in the other array
  const isEditContestPermission = useCheckPermissions("edit_contest");

  const isNextButtonDisabled = () => {
    return categoryWods?.length === 0;
  };

  return (
    <>
      <section className="flex flex-col gap-3 min-h-full h-full bg-white shadow-md rounded-md dark:bg-neutral-900 p-3 pb-0 antialiased">
        <TableHeader
          title="Wods por categoría"
          icon={FaUserShield}
          actions={[
            {
              label: "Siguiente",
              disabled: isNextButtonDisabled(),
              action: () => setActiveTab(),
              icon: FaChevronRight,
              color: "indigo",
              iconRight: true,
            },
          ]}
        />
        <div className="h-full grid grid-cols-2 gap-8 p-2 pt-4 pb-0">
          <div className="col-span-1 lg:col-span-1">
            <div className="md:mb-4">
              <h3 className="text-sm lg:text-lg font-semibold">Categorías</h3>
              <p className="text-sm text-neutral-500">
                Estás son las categorías a usar en esta competencía
              </p>
            </div>
            {contestCategories &&
              contestCategories?.length > 0 &&
              contestCategories
                ?.sort((a, b) => a.name.localeCompare(b.name))
                .map((category) => (
                  <div
                    key={category.id}
                    onClick={() => changeActiveCategory(category)}
                    className={classNames(
                      "group p-4   border-b border-neutral-100 flex justify-between items-center text-neutral-700 hover:bg-neutral-100 cursor-pointer"
                    )}
                  >
                    <div className="flex gap-4 items-center">
                      <LiaDumbbellSolid size={20} />
                      <h3 className="text-sm lg:text-lg font-semibold capitalize">
                        {category.name}
                      </h3>
                    </div>
                    {/* {!contestCategoriesFiltered?.includes(category.id) && (
                      <i
                      className={classNames(
                        'group-hover:text-neutral-800 transition-all duration-200',
                        activeTab == category?.id ? '' : 'text-white',
                      )}
                    >
                      <FaChevronRight size={18} className="text-lg mt-0.5" />
                    </i>
                    )} */}
                  </div>
                ))}
          </div>
          <div className="col-span-1 lg:col-span-1 h-full lg:max-h-[76dvh] overflow-hidden">
            <div className="mb-4 flex flex-col justify-between">
              <div className="md:mb-4">
                <h3 className="text-sm lg:text-lg font-semibold">Wods</h3>
                <p className="text-sm text-neutral-500">
                  Seleccioné los wods a utilizar en la categoría seleccionada
                </p>
              </div>
              <div className="space-y-6">
                <div className="grid gap-2 grid-cols-1">
                  {contestWods &&
                    contestWods?.length > 0 &&
                    contestWods.map((wod) => (
                      <label
                        key={wod.id || wod.name}
                        className="flex items-center gap-2 hover:bg-neutral-100 group-hover:bg-neutral-100 p-2 rounded-md cursor-pointer"
                      >
                        {isEditContestPermission.hasPermission ? (
                          <TextInput
                            color={"warning"}
                            type="checkbox"
                            name={wod.name}
                            value={wod.name}
                            disabled={
                              isDisabled ||
                              !isEditContestPermission.hasPermission
                            }
                            checked={
                              !!categoryWods?.find(
                                (c) => c?.contestWodId === wod?.conWodId
                              )
                            }
                            onChange={(e) =>
                              updateWodOfCategory(wod, e.target.checked)
                            }
                          />
                        ) : (
                          <TextInput
                            color={"warning"}
                            type="checkbox"
                            name={permission.name}
                            value={permission.name}
                            disabled={
                              isDisabled ||
                              !isEditContestPermission.hasPermission
                            }
                            // checked={
                            //   !!rolePermissions?.find(
                            //     (p) => p?.permissionId === permission?.id,
                            //   )
                            // }
                            onChange={null}
                          />
                        )}
                        <span className="text-sm lg:text-base">{wod.name}</span>
                      </label>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default CategoryWods;
