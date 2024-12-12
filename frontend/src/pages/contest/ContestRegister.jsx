import TableHeader from "../../components/Table/TableHeader";
import {
  FaMinusCircle,
  FaPlusCircle,
  FaRegCheckCircle,
  FaUser,
  FaUserMinus,
  FaUserPlus,
} from "react-icons/fa";
import classNames from "classnames";
import { useCallback, useEffect, useRef, useState } from "react";
import { LiaDumbbellSolid } from "react-icons/lia";
import { useContestContext } from "../../context/ContestContext";
import { Select, TextInput } from "flowbite-react";
import { LuSearch } from "react-icons/lu";
import { useQuery } from "@tanstack/react-query";
import { searchUsers as searchAthletes } from "../../services/api";
import { calculateAge } from "../../utils/formatDates";
import { useParams } from "react-router-dom";
import { PiMedalFill } from "react-icons/pi";
import ActionButtons from "../../components/ActionButtons/ActionButtons";

const CategoryWods = ({ setActiveTab }) => {
  // ContestId
  const {
    categories: contestCategories,
    addAthleteToContest,
    removeAthleteFromContest,
    contest,
  } = useContestContext();
  const [isDisabled, setIsDisabled] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const { id } = useParams();
  const [registeredAthletes, setRegisteredAthletes] = useState([]);
  const [searchFilters, setSearchFilters] = useState({
    searchTerm: "",
    pageSize: 10,
    page: 1,
    sortBy: "firstName",
    order: "asc",
    role: "Athlete",
    contestId: id,
  });
  const lastChange = useRef();
  const [activeCategory, setActiveCategory] = useState(
    contestCategories?.length > 0 ? contestCategories[0]?.conCatId : null
  );

  useEffect(() => {
    if (contestCategories?.length > 0) {
      setActiveCategory(contestCategories[0]?.conCatId);
    }
  }, [contestCategories]);
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
      <section className="flex flex-col gap-3 min-h-full h-full rounded-md dark:bg-neutral-900 text-neutral-700 p-2 pb-0 antialiased">
        <div className="bg-white rounded-md p-2 border border-neutral-200">
          <TableHeader
            title={`${contest.name} - Registro de atletas`}
            backAction={true}
            icon={LiaDumbbellSolid}
          />
        </div>
        <div className="h-full grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-4 pb-0">
          <div className="hidden lg:block col-span-1 lg:col-span-1 bg-white p-4 rounded-md border border-neutral-200">
            <div className="md:pb-4">
              <div className="flex items-center gap-2">
                <i className="inline-block">
                  <PiMedalFill size={24} />
                </i>
                <h3 className="text-lg lg:text-2xl font-semibold">
                  Categorías
                </h3>
              </div>
              <p className="text-sm text-neutral-500">
                Estás son las categorías disponibles en está competencia
              </p>
            </div>
            <div className="flex flex-col gap-2">
              {contestCategories &&
                contestCategories?.length > 0 &&
                contestCategories
                  ?.sort((a, b) => a.name.localeCompare(b.name))
                  .map((category) => (
                    <div
                      key={category.id}
                      onClick={() => changeActiveCategory(category)}
                      className={classNames(
                        "group px-4 py-3 rounded-md border-neutral-100 flex justify-between items-center text-neutral-700  cursor-pointer",
                        activeCategory === category.conCatId
                          ? "text-white font-bold opacity-80 bg-neutral-900 hover:opacity-75"
                          : "hover:bg-neutral-100"
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
          </div>
          <div className="col-span-1 md:col-span-3 lg:col-span-2 h-full max-h-[83.5dvh] overflow-hidden bg-white p-4 pb-0 rounded-md border border-neutral-200">
            <div className=" flex flex-col justify-between">
              <div className="w-full flex justify-between flex-col pb-4 xl:pb-2 xl:flex-row gap-2">
                <div>
                  <div className="flex gap-3 items-center">
                    <FaUser size={20} />
                    <h3 className="text-sm lg:text-lg font-semibold">
                      Atletas
                    </h3>
                  </div>
                  <p className="text-sm text-neutral-500">
                    Incriba los atletas a la categoría seleccionada
                  </p>
                </div>
                <div>
                  <Select
                    className="lg:min-w-48"
                    icon={PiMedalFill}
                    value={activeCategory || ""}
                    onChange={(e) => {
                      const selectedCategoryId = e.target.value;
                      const selectedCategory = contestCategories.find(
                        (cat) => cat.conCatId == selectedCategoryId
                      );

                      changeActiveCategory(selectedCategory);
                    }}
                  >
                    <option value="" disabled>
                      Seleccione una categoría
                    </option>
                    {contestCategories &&
                      contestCategories.length > 0 &&
                      contestCategories
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((category) => (
                          <option key={category.id} value={category.conCatId}>
                            {category.name}
                          </option>
                        ))}
                  </Select>
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
              <div className="h-full max-h-[63.5dvh] xl:max-h-[68dvh] overflow-auto flex flex-col gap-1 md:gap-2">
                {activeCategory &&
                  athletes?.data &&
                  athletes?.data?.length > 0 &&
                  athletes?.data
                    .filter(
                      (athlete) =>
                        athlete.contestCategoryAthlete[0]?.contestCategoryId ===
                          activeCategory ||
                        athlete.contestCategoryAthlete?.length === 0
                    )
                    .map((athlete) => (
                      <div
                        key={athlete.id}
                        onClick={async () => {
                          !(
                            athlete.contestCategoryAthlete[0]
                              ?.contestCategoryId === activeCategory
                          )
                            ? await addAthleteToContest({
                                userId: athlete.id,
                                categoryId: activeCategory,
                              })
                            : await removeAthleteFromContest(
                                athlete.contestCategoryAthlete[0]?.id
                              );
                        }}
                        className={classNames(
                          "group transition-all ease-in-out duration-200 px-4  cursor-pointer py-2 border border-neutral-200 rounded-md flex justify-between items-center",
                          athlete.contestCategoryAthlete[0]
                            ?.contestCategoryId === activeCategory
                            ? "bg-green-100 text-neutral-700 hover:bg-purple-50/80"
                            : "text-neutral-800 hover:bg-green-200"
                        )}
                      >
                        <div
                          className={classNames(
                            "flex flex-col",
                            athlete.contestCategoryAthlete[0]
                              ?.contestCategoryId === activeCategory
                              ? "group-hover:text-crossfit-danger"
                              : "text-neutral-800"
                          )}
                        >
                          <h3 className="text-sm lg:text-lg font-semibold capitalize">
                            {`${athlete?.firstName} ${athlete?.lastName}`}
                          </h3>
                          <p>
                            {`${
                              calculateAge(athlete.birthdate)
                                ? calculateAge(athlete.birthdate) + " años"
                                : "N/A"
                            }`}
                          </p>
                        </div>
                        <i className="flex items-center pb-1">
                          {athlete.contestCategoryAthlete[0]
                            ?.contestCategoryId === activeCategory ? (
                            <ActionButtons
                              extraActions={[
                                {
                                  label: "Remover",
                                  type: "button",
                                  icon: FaUserMinus,
                                  action: () => {},
                                  filled: true,
                                  color: "danger",
                                },
                              ]}
                            />
                          ) : (
                            <ActionButtons
                              extraActions={[
                                {
                                  label: "Inscribir",
                                  type: "button",
                                  icon: FaUserPlus,
                                  action: () => {},
                                  filled: true,
                                  color: "dark",
                                },
                              ]}
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
