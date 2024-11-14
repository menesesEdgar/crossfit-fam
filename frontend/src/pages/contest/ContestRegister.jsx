import TableHeader from "../../components/Table/TableHeader";
import { FaChevronRight, FaRegCheckCircle, FaUser, FaUserShield } from "react-icons/fa";
import useCheckPermissions from "../../hooks/useCheckPermissions";
import classNames from "classnames";
import { useCallback, useEffect, useRef, useState } from "react";
import { LiaDumbbellSolid } from "react-icons/lia";
import { useContestContext } from "../../context/ContestContext";
import { TextInput } from "flowbite-react";
import { LuSearch } from "react-icons/lu";
import { useQuery } from "@tanstack/react-query";
import { searchUsers as searchAthletes } from "../../services/api";
import { Field } from "formik";
import { MdInfo, MdRemoveCircleOutline } from "react-icons/md";
import { calculateAge } from "../../utils/formatDates";
import { useParams } from "react-router-dom";

const CategoryWods = ({ setActiveTab }) => {
  // ContestId
  const {
    categories: contestCategories,
    addAthleteToContest,
    removeAthleteFromContest
  } = useContestContext();
  const [isDisabled, setIsDisabled] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const { id } = useParams()
  const [registeredAthletes, setRegisteredAthletes] = useState([])
  const [searchFilters, setSearchFilters] = useState({
    searchTerm: "",
    pageSize: 10,
    page: 1,
    sortBy: "firstName",
    order: "asc",
    role: "Athlete",
    contestId: id
  });  const lastChange = useRef()
  const [activeCategory, setActiveCategory] = useState(
    contestCategories?.length > 0 ? contestCategories[0]?.conCatId : null
  );

  useEffect(() => {
    if (contestCategories?.length > 0) {
      setActiveCategory(contestCategories[0]?.conCatId)
    }
  }, [contestCategories])
  const {
  data: athletes,
  refetch,
  isLoading,
  isPending,
  } = useQuery({
  queryKey: ["athletes", { ...searchFilters }],
  queryFn: ({ signal }) => searchAthletes({ ...searchFilters, signal }),
  staleTime: Infinity,
  });
  useEffect(() => {
    refetch();
  }, [searchFilters]);
  
  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      if (lastChange.current) {
        clearTimeout(lastChange.current);
      }
      lastChange.current = setTimeout(() => {
        lastChange.current = null;
        setSearchFilters((prevState) => {
          return {
            ...prevState,
            searchTerm: e.target.value,
          };
        });
      }, 600);
    },
    [searchFilters]
  );
  const changeActiveCategory = (tab) => {
    setActiveCategory(tab?.conCatId);
  };

  return (
    <>
      <section className="flex flex-col gap-3 min-h-full h-full bg-white shadow-md rounded-md dark:bg-neutral-900 p-3 pb-0 antialiased">
        <TableHeader
          title="Registro de atletas"
          icon={FaUserShield}
        />
        <div className="h-full grid grid-cols-2 gap-8 p-2 pt-4 pb-0">
          <div className="col-span-1 lg:col-span-1">
            <div className="md:mb-4">
              <h3 className="text-sm lg:text-lg font-semibold">Categorías</h3>
              <p className="text-sm text-neutral-500">
                Estás son las categorías disponibles en está competencia
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
                      "group p-4   border-b border-neutral-100 flex justify-between items-center text-neutral-700 hover:bg-neutral-100 cursor-pointer",
                      activeCategory === category.conCatId ? "text-neutral-600 font-bold opacity-80 bg-neutral-700/10" : ""
                      
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
              <div className="w-full flex justify-between flex-col md:flex-row gap-2">
                <div className="mb-2 md:mb-4">
                  <h3 className="text-sm lg:text-lg font-semibold">Atletas</h3>
                  <p className="text-sm text-neutral-500">
                    Incriba los atletas a la categoría seleccionada
                  </p>
                </div>
              </div>
                <div className="relative w-full pb-4">
                  <TextInput
                    icon={LuSearch}
                    type="search"
                    placeholder="Buscar"
                    onChange={handleSearch}
                    className="h-10 w-full"
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: "5px",
                      border: "1px solid #e5e5e5",
                    }}
                  />
                </div>
              <div className="h-full max-h-[30dvh] md:max-h-[67dvh] pb-4 overflow-auto flex flex-col 2xl:grid 2xl:grid-cols-2 2xl:grid-rows-[repeat(auto-fill,_minmax(50px,_1fr))] gap-1 md:gap-2">
                {activeCategory && athletes?.data &&
                  athletes?.data?.length > 0 &&
                  athletes?.data.filter((athlete) => athlete.contestCategoryAthlete[0]?.contestCategoryId === activeCategory || athlete.contestCategoryAthlete?.length === 0)
                    .map((athlete) => (
                      <div
                        key={athlete.id}
                        onClick={async () => {
                          !(athlete.contestCategoryAthlete[0]?.contestCategoryId === activeCategory) ?
                          await addAthleteToContest({
                            userId: athlete.id,
                            categoryId: activeCategory,
                          }) : await removeAthleteFromContest(athlete.contestCategoryAthlete[0]?.id)
                        }}
                        className={classNames(
                          "group pl-6 pr-2 hover:bg-neutral-200/80 cursor-pointer py-2 border border-neutral-300 rounded-md flex justify-between items-center",
                          athlete.contestCategoryAthlete[0]?.contestCategoryId === activeCategory  ? "bg-green-500 text-white" : "text-neutral-600"
                        )}
                      >
                        <div className="flex gap-4 items-center  group-hover:text-red-500">
                          <FaUser  size={20} />
                          <h3 className="text-sm lg:text-lg font-semibold capitalize">
                            {`${athlete?.firstName} ${athlete?.lastName} - ${calculateAge(athlete.birthdate)} años`}
                          </h3>
                        </div>
                        <i className="flex items-center mb-1">
                          {athlete.contestCategoryAthlete[0]?.contestCategoryId === activeCategory? (
                            <FaRegCheckCircle 
                            size={22}
                            className="text-lg mt-0.5 text-white group-hover:text-red-500"
                            />
                          ) : (
                            <MdRemoveCircleOutline
                            size={22}
                            className="text-lg mt-0.5 text-neutral-600 group-hover:text-red-500"
                            />
                          )}

                        </i>
                      </div>
                    ))}
            </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default CategoryWods;
