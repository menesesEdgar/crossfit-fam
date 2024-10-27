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

const ContestCategories = () => {
    // ContestId
    const { id } = useParams()
    const { addCategory , fetchContest, contest, deleteCategory} = useContestContext()
    const {categories} = useCatalogContext()
    const { contestCategory } = contest
    let contestCategories = []
    console.log("contest ", contest)
    const [activeTab, setActiveTab] = useState(
        categories?.length > 0 ? categories[0]?.id : null,
      );
      useEffect(() => {
        fetchContest(id)
      }, [])
    const isAddContestCategoriesPermission = useCheckPermissions('view_contest');
      console.log("contestCategory ", contestCategory)
    if (contestCategory && contestCategory?.length > 0) {
      contestCategories = contestCategory?.map((c) => c.id)
    }
    console.log("contestCategories  ", contestCategories)
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
                <h3 className="text-sm lg:text-lg font-semibold">Seleccione las categorías a usar en la competencia</h3>
                {/* <p className="text-sm text-neutral-500">
                    Seleccione las categorías a usar en la competencia
                </p> */}
              </div>
              {categories && categories?.length > 0 &&
                categories?.sort((a, b) => a.name.localeCompare(b.name))
                .map((category) => (
                  <div
                    key={category.id}
                    onClick={!contestCategories?.includes(category.id) ? async () => { await addCategory({contestId: id, categoryId: category.id})} : () => {}}
                    className={classNames(
                      'group p-4   border-b border-neutral-100 flex justify-between items-center',
                      contestCategories?.includes(category.id)
                        ? 'text-crossfit-light-purple cursor-not-allowed font-bold'
                        : 'text-neutral-700 hover:bg-neutral-100 cursor-pointer ',
                    )}
                  >
                    <div className="flex gap-4 items-center">
                      <LiaDumbbellSolid size={20} />
                      <h3 className="text-sm lg:text-lg font-semibold capitalize">
                        {category.name}
                      </h3>
                    </div>
                    {!contestCategories?.includes(category.id) && (
                      <i
                      className={classNames(
                        'group-hover:text-neutral-800 transition-all duration-200',
                        activeTab == category?.id ? '' : 'text-white',
                      )}
                    >
                      <FaChevronRight size={18} className="text-lg mt-0.5" />
                    </i>
                    )}

                  </div>
                ))}
            </div>
            <div className="col-span-1 lg:col-span-1 h-full lg:max-h-[76dvh] overflow-hidden">
            <div className="mb-4 flex flex-col justify-between">
              <div>
                <h3 className="text-sm lg:text-lg font-semibold">
                  Categorías seleccionadas
                </h3>
                <p className="text-sm text-neutral-500">
                 Selecciona la que desees remover
                </p>
              </div>
              {contestCategory && contestCategory?.length > 0 &&
                contestCategory?.sort((a, b) => a.name.localeCompare(b.name))
                .map((category) => (
                  <div
                    key={category.id}
                    onClick={async () => { await deleteCategory({contestId: id, categoryId: category.conCatId})}}
                    className={classNames(
                      'group p-4 hover:bg-neutral-100 text-neutral-700 border-b border-neutral-100 cursor-pointer flex justify-between items-center',
                    )}
                  >
                    <div className="flex gap-4 items-center">
                      <LiaDumbbellSolid size={20} />
                      <h3 className="text-sm lg:text-lg font-semibold capitalize">
                        {category.name}
                      </h3>
                    </div>
                    <i
                      className={classNames(
                        'group-hover:text-neutral-800 transition-all duration-200',
                        activeTab == category?.id ? '' : 'text-white',
                      )}
                    >
                      <FaDeleteLeft size={24} className="text-lg mt-0.5 text-red-500" />
                    </i>
                  </div>
                ))}
            </div>
          </div>

          </div>
        </section>
        </>
    );
}
 
export default ContestCategories;