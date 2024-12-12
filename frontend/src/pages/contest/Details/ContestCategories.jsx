import TableHeader from "../../../components/Table/TableHeader";
import { FaChevronRight } from "react-icons/fa";
import useCheckPermissions from "../../../hooks/useCheckPermissions";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { LiaDumbbellSolid } from "react-icons/lia";
import { useParams } from "react-router-dom";
import { useContestContext } from "../../../context/ContestContext";
import { useCatalogContext } from "../../../context/CatalogContext";
import { MdRemoveCircleOutline } from "react-icons/md";
import { TextInput } from "flowbite-react";
import { PiMedalFill } from "react-icons/pi";

const ContestCategories = ({ setActiveTab }) => {
  const {
    addCategory,
    categories: contestCategories,
    deleteCategory,
    addAllCategories,
    removeAllContestCategories,
  } = useContestContext();
  const { categories } = useCatalogContext();
  let contestCategoriesFiltered = [];
  const [selectAll, setSelectAll] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    if (categories && contestCategories) {
      if (categories.length === contestCategories.length) {
        setSelectAll(true);
      } else {
        setSelectAll(false);
      }
    }
  }, [categories, contestCategories]);

  const isAddContestCategoriesPermission = useCheckPermissions("view_contest");
  if (contestCategories && contestCategories?.length > 0) {
    contestCategoriesFiltered = contestCategories?.map((c) => c.id);
  }

  const handleSelectAll = async () => {
    if (selectAll) {
      await removeAllContestCategories(id);
    } else {
      await addAllCategories(id);
    }
  };

  const isNextButtonDisabled = () => {
    return contestCategoriesFiltered.length === 0;
  };
  return (
    <>
      <section className="flex h-full max-h-[79.5dvh] md:max-h-[82dvh] overflow-hidden flex-col gap-3 p-3 antialiased">
        <TableHeader
          title="Categorías registradas"
          icon={PiMedalFill}
          backAction
          actions={[
            {
              label: "Siguiente",
              disabled: isNextButtonDisabled(),
              action: () => setActiveTab(),
              icon: FaChevronRight,
              color: "crossfit",
              filled: isNextButtonDisabled() ? false : true,
              iconRight: true,
            },
          ]}
        />
        <div className="flex-1 h-full max-h-[62dvh] grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 p-2 pb-0">
          <div className="col-span-1 h-full min-h-[25dvh] md:border-r-neutral-200 md:border-r md:pr-4">
            <div className="w-full flex justify-between flex-row gap-2">
              <div className="mb-2 md:mb-4">
                <h3 className="text-sm lg:text-lg font-semibold">
                  Todas las categorías
                </h3>
                <p className="text-sm text-neutral-500">
                  Selecciona la categoría que desees agregar.
                </p>
              </div>
              <div className="flex gap-2 items-center text-sm">
                <span className="hidden md:block">
                  {selectAll ? "Deseleccionar todas" : "Seleccionar todas"}
                </span>
                <TextInput
                  type="checkbox"
                  label="Seleccionar todas"
                  color="purple"
                  checked={selectAll}
                  onChange={() => {
                    setSelectAll(!selectAll);
                    handleSelectAll();
                  }}
                />
              </div>
            </div>
            <div className="flex-1 h-full md:max-h-[67dvh] pb-4 overflow-auto flex flex-col 2xl:grid 2xl:grid-cols-2 2xl:grid-rows-[repeat(auto-fill,_minmax(50px,_1fr))] gap-1 md:gap-2">
              {categories &&
                categories?.length > 0 &&
                categories
                  ?.sort((a, b) => a.name.localeCompare(b.name))
                  .map((category) => (
                    <div
                      key={category.id}
                      onClick={
                        !contestCategoriesFiltered?.includes(category.id)
                          ? async () => {
                              await addCategory({
                                contestId: id,
                                categoryId: category.id,
                              });
                            }
                          : async () =>
                              await deleteCategory({
                                contestId: id,
                                categoryId: contestCategories.find(
                                  (c) => c.id === category.id
                                )?.conCatId,
                              })
                      }
                      className={classNames(
                        "group pl-6 pr-2 py-2 border border-neutral-300 rounded-md flex justify-between items-center",
                        contestCategoriesFiltered?.includes(category.id)
                          ? "text-neutral-600 cursor-not-allowed font-bold opacity-80 bg-neutral-700/10"
                          : "text-neutral-700 hover:bg-neutral-200/80 cursor-pointer "
                      )}
                    >
                      <div className="flex gap-4 items-center">
                        <LiaDumbbellSolid size={20} />
                        <h3 className="text-sm lg:text-lg font-semibold capitalize">
                          {category.name}
                        </h3>
                      </div>
                      {!contestCategoriesFiltered?.includes(category.id) && (
                        <i
                          className={classNames(
                            "text-white group-hover:text-neutral-800 transition-all duration-200"
                          )}
                        >
                          <FaChevronRight size={18} className="text-lg" />
                        </i>
                      )}
                    </div>
                  ))}
            </div>
          </div>
          <div className="hidden md:block col-span-1 h-full min-h-[28dvh]">
            <div className="mb-2 md:mb-4">
              <h3 className="text-sm lg:text-lg font-semibold">
                Categorías seleccionadas
              </h3>
              <p className="text-sm text-neutral-500">
                Categorías seleccionadas para la competencia.
              </p>
            </div>
            <div className="h-full max-h-[30dvh] md:max-h-[67dvh] pb-4 overflow-auto flex flex-col 2xl:grid 2xl:grid-cols-2 2xl:grid-rows-[repeat(auto-fill,_minmax(50px,_1fr))] gap-1 md:gap-2">
              {contestCategories &&
                contestCategories?.length > 0 &&
                contestCategories
                  ?.sort((a, b) => a.name.localeCompare(b.name))
                  .map((category) => (
                    <div
                      key={category.id}
                      onClick={async () => {
                        await deleteCategory({
                          contestId: id,
                          categoryId: category.conCatId,
                        });
                      }}
                      className={classNames(
                        "group pl-6 pr-2 hover:bg-neutral-200/80 cursor-pointer py-2 border border-neutral-300 rounded-md flex justify-between items-center"
                      )}
                    >
                      <div className="flex gap-4 items-center text-neutral-600 group-hover:text-red-500">
                        <LiaDumbbellSolid size={20} />
                        <h3 className="text-sm lg:text-lg font-semibold capitalize">
                          {category.name}
                        </h3>
                      </div>
                      <i className="flex items-center mb-1">
                        <MdRemoveCircleOutline
                          size={22}
                          className="text-lg mt-0.5 text-neutral-600 group-hover:text-red-500"
                        />
                      </i>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContestCategories;
