import React, { useEffect, useState, lazy } from "react";
import Skeleton from "react-loading-skeleton";
import { useCatalogContext } from "../../context/CatalogContext";
import { formatMxnDate } from "../../utils/formatDates";
import { useNavigate } from "react-router-dom";
import { FaMedal, FaTrophy } from "react-icons/fa";
import CardContest from "../../components/Card/CardContest";
const TableHeader = lazy(() => import("../../components/Table/TableHeader"));
const TableActions = lazy(() => import("../../components/Table/TableActions"));
const TableResultsNotFound = lazy(() =>
  import("../../components/Table/TableResultsNotFound")
);
import BgPublicContest from "../../assets/bg/bg-public-contest.webp";
import { IoPersonAddOutline } from "react-icons/io5";
import { RiBarChart2Fill } from "react-icons/ri";
import { Checkbox, Dropdown, Label } from "flowbite-react";
import { MdOutlineFilterList } from "react-icons/md";
import ModalAuthUser from "../../components/Modals/ModalAuthUser";

const PublicContest = () => {
  const { publicContests: allContests, loading } = useCatalogContext();
  const [contests, setContests] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const navigate = useNavigate();
  const filteredContests = contests?.filter(
    (contest) =>
      JSON.stringify(contest).toLowerCase().includes(search.toLowerCase()) &&
      (statusFilter.length === 0 || statusFilter.includes(contest.status))
  );

  const handleFilterByStatus = (status) => {
    setStatusFilter((prevStatusFilter) => {
      if (prevStatusFilter.length === 0) {
        return [status];
      }

      if (prevStatusFilter.includes(status)) {
        return prevStatusFilter.filter((s) => s !== status);
      } else {
        return [...prevStatusFilter, status];
      }
    });
  };

  const handleFilterAll = () => {
    setStatusFilter([]);
  };

  useEffect(() => {
    setContests(allContests);
  }, [allContests]);

  const extractAthletesFromCategories = (categories) => {
    return categories?.reduce((acc, category) => {
      return acc + category?.athletes?.length;
    }, 0);
  };

  const extractCategoryNames = (categories) => {
    return categories?.map((category) => category?.category?.name);
  };

  const handleAction = (status, selectedContest) => {
    switch (status) {
      case "Abierta":
        return {
          label: "Inscribirme",
          action: () => setOpenModal(true),
          icon: IoPersonAddOutline,
          color: "neutral",
        };
      case "Finalizada":
        return {
          label: "Ver resultados",
          action: () => navigate(`/public/contest/${selectedContest.id}/scores`),
          icon: FaMedal,
          color: "neutral",
        };

      case "En curso":
        return {
          label: "Ver progreso",
          action: () => navigate(`/public/contest/${selectedContest.id}/scores`),
          icon: RiBarChart2Fill,
          color: "neutral",
        };
      default:
        return "Inscribirme";
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${BgPublicContest})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="flex-1 min-h-[92.3dvh] md:min-h-[93.2dvh] h-full max-h-[90.5dvh] md:max-h-[92dvh] overflow-hidden flex flex-col antialiased"
    >
      <div className="flex-1 flex flex-col gap-4 w-full h-full bg-purple-50/25 pt-4 px-4">
        <div className="flex flex-col md:flex-row bg-white px-2 md:px-4 py-1 md:py-2 rounded-lg justify-between w-full gap-4">
          <TableHeader icon={FaTrophy} title={"Competencias"} />
          <div className="flex gap-2">
            <TableActions handleSearchTerm={(e) => setSearch(e.target.value)} />
            <Dropdown
              renderTrigger={() => (
                <button className="w-fit bg-white hover:bg-neutral-200 md:w-fit h-9 xl:h-10 text-sm xl:text-base cursor-pointer transition ease-in-out duration-200 p-4 flex items-center justify-center rounded-md border text-stone-800">
                  <MdOutlineFilterList className="text-lg text-neutral-900" />
                </button>
              )}
            >
              <Dropdown.Item
                onClick={() => handleFilterByStatus("Abierta")}
                className="flex items-center gap-2"
              >
                <Checkbox
                  id="open"
                  color="purple"
                  type="checkbox"
                  readOnly
                  checked={statusFilter.includes("Abierta")}
                  className="mr-2 cursor-pointer h-6 w-6"
                />
                <Label htmlFor="open">Abierta</Label>
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => handleFilterByStatus("En curso")}
                className="flex items-center gap-2"
              >
                <Checkbox
                  id="in_curse"
                  color="purple"
                  type="checkbox"
                  readOnly
                  checked={statusFilter.includes("En curso")}
                  className="mr-2 cursor-pointer h-6 w-6"
                />
                <Label htmlFor="in_curse">En curso</Label>
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => handleFilterByStatus("Finalizada")}
                className="flex items-center gap-2"
              >
                <Checkbox
                  id="finished"
                  color="purple"
                  type="checkbox"
                  readOnly
                  checked={statusFilter.includes("Finalizada")}
                  className="mr-2 cursor-pointer h-6 w-6"
                />
                <Label htmlFor="finished">Finalizada</Label>
              </Dropdown.Item>
              <Dropdown.Item
                onClick={handleFilterAll}
                className="flex items-center gap-2"
              >
                <Checkbox
                  id="all"
                  color="purple"
                  type="checkbox"
                  readOnly
                  checked={statusFilter.length === 0}
                  className="mr-2 cursor-pointer h-6 w-6"
                />
                <Label htmlFor="all">Todas las competencias</Label>
              </Dropdown.Item>
            </Dropdown>
          </div>
        </div>
        {filteredContests && !loading ? (
          filteredContests?.length > 0 ? (
            <div className="pb-4 h-full md:min-h-[84dvh] max-h-[77.2dvh] overflow-auto grid gap-4 md:gap-6 grid-cols-[repeat(auto-fill,_minmax(330px,_1fr))] md:grid-cols-[repeat(auto-fill,_minmax(400px,_1fr))]">
              {filteredContests?.map((contest, index) => {
                const parseContest = {
                  id: contest.id,
                  title: contest.name,
                  organizer: contest.organizer,
                  startDate: formatMxnDate(contest?.startDate || null),
                  endDate:
                    formatMxnDate(contest?.endDate || null) || "Sin fecha",
                  status: contest.status,
                  location: contest.location,
                  quantityAthletes: contest?.categories
                    ? extractAthletesFromCategories(contest?.categories)
                    : 0,
                  categories: contest?.categories
                    ? extractCategoryNames(contest.categories)
                    : [],
                };
                return (
                  <CardContest
                    key={contest.id}
                    contest={parseContest}
                    actions={[handleAction(contest.status, contest)]}
                  />
                );
              })}
            </div>
          ) : (
            <div className="w-full h-full min-h-96 bg-white">
              <TableResultsNotFound />
            </div>
          )
        ) : (
          <Skeleton count={10} className="h-10" />
        )}
      </div>
      {openModal && (
        <ModalAuthUser
          openModal={openModal}
          setOpenModal={() => setOpenModal(!openModal)}
        />
      )}
    </div>
  );
};

export default PublicContest;
