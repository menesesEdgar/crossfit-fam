import React, { useCallback, useEffect, useRef, useState, lazy } from "react";

import Skeleton from "react-loading-skeleton";
import { IoMdAdd } from "react-icons/io";
import { useCatalogContext } from "../../context/CatalogContext";
import ModalRemove from "../../components/Modals/ModalRemove";
import ContestFormFields from "../../components/ContestComponents/ContestFormFields";
import ModalFormikForm from "../../components/Modals/ModalFormikForm";
import { ContestFormSchema } from "../../components/ContestComponents/ContestFormSchema";
import withPermission from "../../utils/withPermissions";
import useCheckPermissions from "../../hooks/useCheckPermissions";
import { formatMxnDate } from "../../utils/formatDates";
import { useNavigate } from "react-router-dom";
import { FaTrophy } from "react-icons/fa";
import CardContest from "../../components/Card/CardContest";
const TableHeader = lazy(() => import("../../components/Table/TableHeader"));
const TableActions = lazy(() => import("../../components/Table/TableActions"));
const TableResultsNotFound = lazy(() =>
  import("../../components/Table/TableResultsNotFound")
);

const initValues = {
  name: "",
  location: "",
  organizer: "",
  startDate: new Date().toISOString().split("T")[0],
  endDate: "",
  status: "Abierta",
  id: "",
};
const Contest = () => {
  const { contests: allContests } = useCatalogContext();
  const { createContest, updateContest, deleteContest, loading } =
    useCatalogContext();
  const isCreatePermissions = useCheckPermissions("create_contest");
  const isEditPermissions = useCheckPermissions("edit_contest");
  const isDeletePermissions = useCheckPermissions("delete_contest");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [removeContestId, setRemoveContestId] = useState(null);
  const [contests, setContests] = useState([]);
  const [search, setSearch] = useState("");
  const [initialValues, setInitialValues] = useState({
    ...initValues,
  });
  const navigate = useNavigate();
  const filteredContests = contests?.filter((contest) =>
    JSON.stringify(contest).toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    setContests(allContests);
  }, [allContests]);

  const onEditContest = (contest) => {
    setEditMode(true);
    setInitialValues({
      ...contest,
      startDate: contest?.startDate ? contest.startDate.split("T")[0] : "",
      endDate: contest?.endDate ? contest.endDate.split("T")[0] : "",
    });
    setIsOpenModal(true);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      editMode ? await updateContest(values) : await createContest(values);
      resetForm();
      setInitialValues({
        ...initValues,
      });
      setIsOpenModal(false);
      setEditMode(false);
    } catch (error) {
      console.log(error);
      setSubmitting(false);
    }
  };

  const onCloseModal = () => {
    setIsOpenModal(false);
    setEditMode(false);
    setInitialValues({
      ...initValues,
    });
  };

  const onDeleteContest = async () => {
    try {
      await deleteContest(removeContestId);
      setIsOpenDeleteModal(false);
      setRemoveContestId(null);
    } catch (error) {
      console.error(error);
      setIsOpenDeleteModal(false);
    }
  };

  const onCloseDeleteModal = () => {
    setIsOpenDeleteModal(false);
    setRemoveContestId(null);
  };

  const onOpenDeleteModal = (contestId) => {
    setIsOpenDeleteModal(true);
    setRemoveContestId(contestId);
  };

  const extractAthletesFromCategories = (categories) => {
    return categories?.reduce((acc, category) => {
      return acc + category?.athletes?.length;
    }, 0);
  };

  const extractCategoryNames = (categories) => {
    return categories?.map((category) => category?.category?.name);
  };

  return (
    <div className="flex min-h-[77dvh] h-full max-h-[90dvh] overflow-hidden flex-col gap-2 md:gap-4 bg-white shadow-md rounded-md dark:bg-gray-900 antialiased">
      <div className="px-2 pt-2 md:px-4 md:pt-4">
        <TableHeader
          icon={FaTrophy}
          title={"Competencias"}
          actions={[
            {
              label: "Nuevo",
              action: isCreatePermissions.hasPermission
                ? () => setIsOpenModal(true)
                : null,
              color: "crossfit",
              icon: IoMdAdd,
              filled: true,
            },
          ]}
        />
        <TableActions handleSearchTerm={(e) => setSearch(e.target.value)} />
      </div>
      {filteredContests && !loading ? (
        filteredContests?.length > 0 ? (
          <div className="px-2 md:px-4 pb-4 h-full max-h-[77.4dvh] overflow-auto grid gap-4 md:gap-6 xl:gap-8 grid-cols-[repeat(auto-fill,_minmax(330px,_1fr))] md:grid-cols-[repeat(auto-fill,_minmax(350px,_1fr))]">
            {filteredContests?.map((contest, index) => {
              const parseContest = {
                id: contest.id,
                title: contest.name,
                organizer: contest.organizer,
                startDate: formatMxnDate(contest?.startDate || null),
                endDate: formatMxnDate(contest?.endDate || null) || "Sin fecha",
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
                  onDelete={
                    isDeletePermissions.hasPermission
                      ? () => onOpenDeleteModal(contest.id)
                      : null
                  }
                  onEdit={
                    isEditPermissions.hasPermission
                      ? () => onEditContest(contest)
                      : null
                  }
                  onView={() => navigate(`/contest/${contest.id}`)}
                />
              );
            })}
          </div>
        ) : (
          <TableResultsNotFound />
        )
      ) : (
        <Skeleton count={10} className="h-10" />
      )}

      {isOpenModal && (
        <ModalFormikForm
          onClose={onCloseModal}
          isOpenModal={isOpenModal}
          dismissible
          title={editMode ? "Editar Competencia" : "Nueva Competencia"}
          schema={ContestFormSchema}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          formFields={<ContestFormFields />}
          saveLabel={editMode ? "Actualizar" : "Guardar"}
        />
      )}
      {isOpenDeleteModal && (
        <ModalRemove
          isOpenModal={isOpenDeleteModal}
          onCloseModal={onCloseDeleteModal}
          removeFunction={onDeleteContest}
        />
      )}
    </div>
  );
};

const ProtectedContest = withPermission(Contest, "view_contest");

export default ProtectedContest;
