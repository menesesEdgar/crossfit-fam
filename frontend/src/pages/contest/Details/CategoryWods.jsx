import TableHeader from "../../../components/Table/TableHeader";
import { FaChevronRight, FaUserShield } from "react-icons/fa";
import useCheckPermissions from "../../../hooks/useCheckPermissions";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { LiaDumbbellSolid } from "react-icons/lia";
import { useParams } from "react-router-dom";
import { useContestContext } from "../../../context/ContestContext";
import { useCatalogContext } from "../../../context/CatalogContext";
import { FaDeleteLeft } from "react-icons/fa6";
import { TextInput } from "flowbite-react";
const CategoryWods = () => {
    // ContestId
    const { id } = useParams()
    const { categories: contestCategories, addWodToCategory, deleteWodOfCategory} = useContestContext()
    const { wods } = useCatalogContext()
    const [isDisabled, setIsDisabled] = useState(false);
    let contestCategoriesFiltered = []
    const [activeTab, setActiveTab] = useState(
      contestCategories?.length > 0 ? contestCategories[0]?.id : null,
      );
      console.log("wods ", wods)
      const isEditContestPermission = useCheckPermissions('edit_contest');
    return (
        <>
        <section className="flex flex-col gap-3 min-h-full h-full bg-white shadow-md rounded-md dark:bg-neutral-900 p-3 pb-0 antialiased">
          <TableHeader
            title="Categorías registradas"
            icon={FaUserShield}
          />
          <div className="h-full grid grid-cols-2 gap-8 p-2 pt-4 pb-0">
            <div className="col-span-1 lg:col-span-1">
              <div className="mb-4">
                <h3 className="text-sm lg:text-lg font-semibold">Categorías</h3>
                <p className="text-sm text-neutral-500">
                    Estás son las categorías a usar en esta competencía
                </p>
              </div>
              {contestCategories && contestCategories?.length > 0 &&
                contestCategories?.sort((a, b) => a.name.localeCompare(b.name))
                .map((category) => (
                  <div
                    key={category.id}
                    onClick={() => {}}
                    className={classNames(
                      'group p-4   border-b border-neutral-100 flex justify-between items-center text-neutral-700 hover:bg-neutral-100 cursor-pointer',
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
              <div>
                <h3 className="text-sm lg:text-lg font-semibold">
                  Wods
                </h3>
                <p className="text-sm text-neutral-500">
                 Seleccioné los wods a utilizar en la categoría seleccionada
                </p>
              </div>
              <div className="space-y-6">
              <div className="grid gap-2 grid-cols-1">
                {wods && wods?.length > 0 && wods.map((wod) => (
                  <label
                    key={wod.id || wod.name}
                    className="flex items-center gap-2 hover:bg-neutral-100 group-hover:bg-neutral-100 p-2 rounded-md cursor-pointer"
                  >
                    {isEditContestPermission.hasPermission ? (
                      <TextInput
                        color={'warning'}
                        type="checkbox"
                        name={wod.name}
                        value={wod.name}
                        disabled={
                          isDisabled || !isEditContestPermission.hasPermission
                        }
                        // checked={
                        //   !!rolePermissions?.find(
                        //     (p) => p?.permissionId === permission?.id,
                        //   )
                        // }
                        // onChange={(e) =>
                        //   updateRolePermission(permission, e.target.checked)
                        // }
                      />
                    ) : (
                      <TextInput
                        color={'warning'}
                        type="checkbox"
                        name={permission.name}
                        value={permission.name}
                        disabled={
                          isDisabled || !isEditContestPermission.hasPermission
                        }
                        // checked={
                        //   !!rolePermissions?.find(
                        //     (p) => p?.permissionId === permission?.id,
                        //   )
                        // }
                        onChange={null}
                      />
                    )}
                    <span className="text-sm lg:text-base">
                      {wod.name}
                    </span>
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
}
export default CategoryWods;