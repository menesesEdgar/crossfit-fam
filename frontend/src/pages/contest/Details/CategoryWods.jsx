import TableHeader from "../../../components/Table/TableHeader";
import { FaChevronRight, FaUserShield } from "react-icons/fa";
import useCheckPermissions from "../../../hooks/useCheckPermissions";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { LiaDumbbellSolid } from "react-icons/lia";
import { useContestContext } from "../../../context/ContestContext";
import { TextInput } from "flowbite-react";
import Accordion from "../../../components/Accordion/Accordion";
import { useParams } from "react-router-dom";
const CategoryWods = ({ setActiveTab }) => {
  // ContestId
  const {
    categories: contestCategories,
    wods: contestWods,
    categoryWods,
    addWodToCategory,
    removeWodOfCategory,
    getWodsByCategoryId,
    removeAllCategoryWods,
    addAllWodsToCategory,
  } = useContestContext();
  const [isDisabled, setIsDisabled] = useState(false);
  const {id} = useParams()
  const [selectAll, setSelectAll] = useState(false);

  const updateWodOfCategory = async (wod, isChecked) => {
    const { conWodId, categoryId } = wod;
    setIsDisabled(true);
    if (isChecked) {
      await addWodToCategory({
        categoryId: categoryId,
        wodId: conWodId,
      });
    } else {
      await removeWodOfCategory({
        categoryId: categoryId,
        wodId: conWodId,
      });
    }
    setTimeout(() => {
      setIsDisabled(false);
    }, 1000);
  };

  // Contest Wods with the conWodId need to be found with the contestWodId in the other array
  const isEditContestPermission = useCheckPermissions("edit_contest");

  const isNextButtonDisabled = () => {
    return !categoryWods || categoryWods?.length === 0;
  };
  const handleSelectAll = async (categoryId, allSelected) => {
    if (allSelected) {
      await removeAllCategoryWods(categoryId);
    } else {
      await addAllWodsToCategory({categoryId, contestId: id});
    }
  };
  
  const handleContestCategories = () => {
    return contestCategories
      ?.map((category) => {
        const allSelected = categoryWods.filter((cWod) => parseInt(cWod.contestCategoryId ) === category.conCatId).length === contestWods.length
        return {
          title: category?.name,
          content: (
            <div className="space-y-6">
              <div className="grid gap-2 grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))]">
                <label className="flex items-center gap-2 hover:bg-neutral-100 p-2 rounded-md cursor-pointer">
                  <TextInput
                    color={"warning"}
                    type="checkbox"
                    name={"selectAll"}
                    checked={allSelected}
                    onChange={() => handleSelectAll(category.conCatId, allSelected)}
                  />
                  <span className="text-sm lg:text-base">
                    Seleccionar todas
                  </span>
                </label>
                {contestWods.map((wod) => (
                  <label
                    key={wod.id}
                    className="flex items-center gap-2 hover:bg-neutral-100 p-2 rounded-md cursor-pointer"
                  >
                    {isEditContestPermission.hasPermission ? (
                      <TextInput
                        color={"warning"}
                        type="checkbox"
                        name={wod.name}
                        value={wod.name}
                        disabled={
                          isDisabled || !isEditContestPermission.hasPermission
                        }
                        checked={!!categoryWods?.find(
                          (ctWod) => ctWod?.contestWodId === wod?.conWodId && parseInt(ctWod.contestCategoryId) === category.conCatId)}
                        onChange={(e) =>
                          updateWodOfCategory(
                            {
                              conWodId: wod.conWodId,
                              categoryId: category.conCatId,
                            },
                            e.target.checked
                          )
                        }
                      />
                    ) : (
                      <TextInput
                        color={"warning"}
                        type="checkbox"
                        name={wod.name}
                        value={wod.name}
                        disabled={
                          isDisabled || !isEditContestPermission.hasPermission
                        }
                        checked={false}
                        onChange={null}
                      />
                    )}
                    <span className="text-sm lg:text-base">{wod.name}</span>
                  </label>
                ))}
              </div>
            </div>
          ),
        };
      })
      .sort((a, b) => a.title.localeCompare(b.title));
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
        {/* <div className="h-full grid grid-cols-2 gap-8 p-2 pt-4 pb-0">
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
                  </div>
                ))}
          </div>
          <div className="col-span-1 lg:col-span-1 h-full lg:max-h-[76dvh] overflow-hidden">
            <div className="mb-4 flex flex-col justify-between">
              <div className="w-full flex justify-between flex-col md:flex-row gap-2">
                <div className="mb-2 md:mb-4">
                  <h3 className="text-sm lg:text-lg font-semibold">Wods</h3>
                  <p className="text-sm text-neutral-500">
                    Seleccioné los wods a utilizar en la categoría seleccionada
                  </p>
                </div>
                <div className="hidden md:flex gap-2 items-center text-sm pr-1">
                  {selectAll ? "Deseleccionar todas" : "Seleccionar todas"}
                  <TextInput
                    type="checkbox"
                    label="Seleccionar todas"
                    checked={selectAll}
                    onChange={() => {
                      setSelectAll(!selectAll);
                      handleSelectAll();
                    }}
                  />
                </div>
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
        </div> */}
        <div className="overflow-y-auto h-full md:max-h-[69dvh] w-full">
          <Accordion data={handleContestCategories() ?? []} />
        </div>
      </section>
    </>
  );
};
export default CategoryWods;
