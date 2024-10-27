import React, { useCallback, useEffect, useRef, useState, lazy } from "react";

import Skeleton from "react-loading-skeleton";
import { useQuery } from "@tanstack/react-query";
import { IoMdAdd } from "react-icons/io";
import { useCatalogContext } from "../../context/CatalogContext";
import ModalRemove from "../../components/Modals/ModalRemove";
import ActionButtons from "../../components/ActionButtons/ActionButtons";
import Notifies from "../../components/Notifies/Notifies";
import ContestFormFields from "../../components/ContestComponents/ContestFormFields";
import ModalFormikForm from "../../components/Modals/ModalFormikForm";
import { ContestFormSchema } from "../../components/ContestComponents/ContestFormSchema";
import { HiCubeTransparent } from "react-icons/hi";
import withPermission from "../../utils/withPermissions";
import useCheckPermissions from "../../hooks/useCheckPermissions";
import { formatDate, formatMxnDate } from "../../utils/formatDates";
import { useNavigate } from "react-router-dom";
const Card = lazy(() => import("../../components/Card/Card"));
const TableHeader = lazy(() => import("../../components/Table/TableHeader"));
const TableFooter = lazy(() => import("../../components/Table/TableHeader"));
const TableActions = lazy(() =>
  import("../../components/Table/TableActions")
);
const TableResultsNotFound = lazy(() =>
  import("../../components/Table/TableResultsNotFound")
);

const initValues = {
  name: "",
  location: "",
  organizer: "",
  startDate: new Date().toISOString().split('T')[0],
  endDate: "",
  status: "Abierta",
  id: "",
}
const Contest = () => {
  const { createContest, updateContest, deleteContest, contests: allContests, loading  } = useCatalogContext();
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
    ...initValues
  });
  const navigate = useNavigate();
  const filteredContests = contests?.filter((contest) => 
    JSON.stringify(contest).toLowerCase().includes(search.toLowerCase()))

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
        ...initValues
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
      ...initValues
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

  return (
    <div className="flex min-h-[77dvh] h-full flex-col gap-3 bg-white shadow-md rounded-md dark:bg-gray-900 p-3 antialiased">
      <TableHeader
        icon={HiCubeTransparent}
        title={"Competencias"}
        actions={[
          {
            label: "Nuevo",
            action: isCreatePermissions.hasPermission
              ? () => setIsOpenModal(true)
              : null,
            color: "mycad",
            icon: IoMdAdd,
            filled: true,
          },
        ]}
      />
      <TableActions handleSearchTerm={(e) => setSearch(e.target.value)} />
      {filteredContests && !loading ? (
        filteredContests?.length > 0 ? (
            <div className="py-2 flex flex-col flex-wrap sm:grid sm:grid-cols-2 md:grid-cols-3 gap-3 ">
              {filteredContests?.map((contest, index) => {
                const parseContest = {
                    name: {
                    key: "Nombre",
                    value: contest.name,
                  },
                  organizer: {
                    key: "Organizador",
                    value: contest.organizer,
                  },
                  startDate: {
                    key: "Fecha de inicio",
                    value: formatMxnDate(contest.startDate),
                  },
                  endDate: {
                    key: "Fecha de cierre",
                    value: formatMxnDate(contest.endDate),
                  },
                  location: {
                    key: "Ubicación",
                    value: contest.location,
                  },
                  status: {
                    key: "Estatus",
                    value: contest.status,
                  },
                  actions: {
                    key: "Acciones",
                    value: (
                      <ActionButtons
                        onEdit={
                          isEditPermissions.hasPermission
                            ? () => onEditContest(contest)
                            : null
                        }
                        onRemove={
                          isDeletePermissions.hasPermission
                            ? () => onOpenDeleteModal(contest.id)
                            : null
                        }
                        onShow={() => {navigate(`/contest/${contest.id}`)}}
                      />
                    ),
                  },
                };
                return <Card key={contest.id} data={parseContest} />;
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
