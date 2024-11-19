import TableHeader from "../../../components/Table/TableHeader";
import { FaChevronLeft, FaChevronRight, FaUserShield } from "react-icons/fa";
import useCheckPermissions from "../../../hooks/useCheckPermissions";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { LiaDumbbellSolid } from "react-icons/lia";
import { useContestContext } from "../../../context/ContestContext";
import { TextInput } from "flowbite-react";
import Accordion from "../../../components/Accordion/Accordion";
import { useParams } from "react-router-dom";
const CategoryWods = ({ setActiveTab, setBackTab }) => {
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
  const { id } = useParams();
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
      await addAllWodsToCategory({ categoryId, contestId: id });
    }
  };

  const handleContestCategories = () => {
    return contestCategories
      ?.map((category) => {
        const allSelected =
          categoryWods.filter(
            (cWod) => parseInt(cWod.contestCategoryId) === category.conCatId
          ).length === contestWods.length;
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
                    onChange={() =>
                      handleSelectAll(category.conCatId, allSelected)
                    }
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
                        checked={
                          !!categoryWods?.find(
                            (ctWod) =>
                              ctWod?.contestWodId === wod?.conWodId &&
                              parseInt(ctWod.contestCategoryId) ===
                                category.conCatId
                          )
                        }
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
              label: "Volver",
              action: () => setBackTab(),
              icon: FaChevronLeft,
              color: "indigo",
            },
            {
              label: "Finalizar",
              disabled: isNextButtonDisabled(),
              action: () => window.history.back(),
              icon: FaChevronRight,
              color: "indigo",
              iconRight: true,
              filled: true,
            },
          ]}
        />

        <div className="overflow-y-auto h-full md:max-h-[69dvh] w-full">
          <Accordion data={handleContestCategories() ?? []} />
        </div>
      </section>
    </>
  );
};
export default CategoryWods;
