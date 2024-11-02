import TableHeader from "../../../components/Table/TableHeader";
import {
  FaCheckSquare,
  FaChevronRight,
  FaSquare,
  FaUserShield,
} from "react-icons/fa";
import useCheckPermissions from "../../../hooks/useCheckPermissions";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { LiaDumbbellSolid } from "react-icons/lia";
import { useParams } from "react-router-dom";
import { useContestContext } from "../../../context/ContestContext";
import { useCatalogContext } from "../../../context/CatalogContext";
import { MdRemoveCircleOutline } from "react-icons/md";
import { TextInput } from "flowbite-react";

const ContestWods = ({ setActiveTab }) => {
  // ContestId
  const { id } = useParams();
  const {
    addWod,
    fetchContest,
    wods: contestWods,
    deleteWod,
    addAllWods,
    removeAllContestWods,
  } = useContestContext();
  const { wods } = useCatalogContext();
  let contestWodsFiltered = [];
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    // fetchContest(id);
  }, []);

  useEffect(() => {
    if (wods && contestWods) {
      if (wods.length === contestWods.length) {
        setSelectAll(true);
      } else {
        setSelectAll(false);
      }
    }
  }, [wods, contestWods]);

  const isAddContestWodsPermission = useCheckPermissions("view_contest");
  if (contestWods && contestWods?.length > 0) {
    contestWodsFiltered = contestWods?.map((c) => c.id);
  }

  const handleSelectAll = async () => {
    if (selectAll) {
      await removeAllContestWods(id);
    } else {
      await addAllWods(id);
    }
  };

  const isNextButtonDisabled = () => {
    return contestWodsFiltered.length === 0;
  };

  return (
    <>
      <section className="flex h-full max-h-[76.5dvh] md:max-h-[82dvh] overflow-hidden flex-col gap-3 p-3 antialiased">
        <TableHeader
          title="Wods registrados"
          icon={FaUserShield}
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
        <div className="flex-1 h-full grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 p-2 pb-0">
          <div className="col-span-1 h-full min-h-[25dvh] md:border-r-neutral-200 md:border-r md:pr-4">
            <div className="w-full flex justify-between flex-col md:flex-row gap-2">
              <div className="md:mb-4">
                <h3 className="text-sm lg:text-lg font-semibold">
                  Todos los wods
                </h3>
                <p className="text-sm text-neutral-500">
                  Selecciona los wods que desee agregar.
                </p>
              </div>
              <div className="hidden md:flex gap-2 items-center text-sm">
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
            <div className="h-full max-h-[27dvh] md:max-h-[67dvh] pb-4 overflow-auto flex flex-col 2xl:grid 2xl:grid-cols-2 2xl:grid-rows-[repeat(auto-fill,_minmax(50px,_1fr))] gap-1 md:gap-2">
              {wods &&
                wods?.length > 0 &&
                wods
                  ?.sort((a, b) => a.name.localeCompare(b.name))
                  .map((wod) => (
                    <div
                      key={wod.id}
                      onClick={
                        !contestWodsFiltered?.includes(wod.id)
                          ? async () => {
                              await addWod({
                                contestId: id,
                                wodId: wod.id,
                              });
                            }
                          : () => {}
                      }
                      className={classNames(
                        "group pl-6 pr-2 py-2 border border-neutral-300 rounded-md flex justify-between items-center",
                        contestWodsFiltered?.includes(wod.id)
                          ? "text-neutral-600 cursor-not-allowed font-bold opacity-80 bg-neutral-700/10"
                          : "text-neutral-700 hover:bg-neutral-200/80 cursor-pointer "
                      )}
                    >
                      <div className="flex gap-4 items-center">
                        <LiaDumbbellSolid size={20} />
                        <h3 className="text-sm lg:text-lg font-semibold capitalize">
                          {wod.name}
                        </h3>
                      </div>
                      {!contestWodsFiltered?.includes(wod.id) && (
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
          <div className="col-span-1 h-full min-h-[28dvh]">
            <div className="md:mb-4">
              <h3 className="text-sm lg:text-lg font-semibold">
                Wods seleccionados
              </h3>
              <p className="text-sm text-neutral-500">
                Wods seleccionados para la competencia.
              </p>
            </div>
            <div className="h-full max-h-[30dvh] md:max-h-[67dvh] pb-4 overflow-auto flex flex-col 2xl:grid 2xl:grid-cols-2 2xl:grid-rows-[repeat(auto-fill,_minmax(50px,_1fr))] gap-1 md:gap-2">
              {contestWods &&
                contestWods?.length > 0 &&
                contestWods
                  ?.sort((a, b) => a.name.localeCompare(b.name))
                  .map((wod) => (
                    <div
                      key={wod.id}
                      onClick={async () => {
                        await deleteWod({
                          contestId: id,
                          wodId: wod.conWodId,
                        });
                      }}
                      className={classNames(
                        "group pl-6 pr-2 hover:bg-neutral-200/80 cursor-pointer py-2 border border-neutral-300 rounded-md flex justify-between items-center"
                      )}
                    >
                      <div className="flex gap-4 items-center text-neutral-600 group-hover:text-red-500">
                        <LiaDumbbellSolid size={20} />
                        <h3 className="text-sm lg:text-lg font-semibold capitalize">
                          {wod.name}
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

export default ContestWods;
