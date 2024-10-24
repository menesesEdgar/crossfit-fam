import React, { useCallback, useEffect, useRef, useState, lazy } from "react";

import Skeleton from "react-loading-skeleton";
import { useQuery } from "@tanstack/react-query";
import { IoMdAdd } from "react-icons/io";
import { useCatalogContext } from "../../context/CatalogContext";
import ModalRemove from "../../components/Modals/ModalRemove";
import { searchContest } from "../../services/api";
import ActionButtons from "../../components/ActionButtons/ActionButtons";
import Notifies from "../../components/Notifies/Notifies";
import ContestFormFields from "../../components/ContestComponents/ContestFormFields";
import ModalFormikForm from "../../components/Modals/ModalFormikForm";
import { ContestFormSchema } from "../../components/ContestComponents/ContestFormSchema";
import { HiCubeTransparent } from "react-icons/hi";
import withPermission from "../../utils/withPermissions";
import useCheckPermissions from "../../hooks/useCheckPermissions";
const Card = lazy(() => import("../../components/Card/Card"));
const TableHeader = lazy(() => import("../../components/Table/TableHeader"));
const TableFooter = lazy(() => import("../../components/Table/TableHeader"));
const TableActions = lazy(() =>
  import("../../components/Table/TableActions")
);
const TableResultsNotFound = lazy(() =>
  import("../../components/Table/TableResultsNotFound")
);
const Contest = () => {
  const { createContest, updateContest, deleteContest } = useCatalogContext();
//   const [columns, setColumns] = useState([...contestColumns]);
  const lastChange = useRef();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [deleteContestId, setDeleteContestId] = useState(null);
  const [initialValues, setInitialValues] = useState({
    name: "",
    location: "",
    organizer: "",
    startDate: "1",
    endDate: "",
    status: "",
    id: "",
  });
  const [refreshData, setRefreshData] = useState(false);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [searchFilters, setSearchFilters] = useState({
    searchTerm: "",
    pageSize: 10,
    page: currentPageNumber,
    sortBy: "name",
    order: "asc",
  });
  const {
    data: contest,
    refetch,
    isLoading,
    isPending,
  } = useQuery({
    queryKey: ["contest", { ...searchFilters }],
    queryFn: ({ signal }) => searchContest({ ...searchFilters, signal }),
    staleTime: Infinity,
  });

  useEffect(() => {
    refetch();
    setRefreshData(false);
  }, [searchFilters, refreshData]);

  const goOnPrevPage = useCallback(() => {
    setSearchFilters((prevState) => {
      return {
        ...prevState,
        page: prevState?.page - 1,
      };
    });
  }, []);

  const goOnNextPage = useCallback(() => {
    setSearchFilters((prevState) => {
      return {
        ...prevState,
        page: prevState?.page + 1,
      };
    });
  }, []);

  const handleSelectChange = useCallback((page) => {
    setSearchFilters((prevState) => {
      return {
        ...prevState,
        page,
      };
    });
  }, []);

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
    [searchFilters?.searchTerm]
  );

  const changePageSize = (e) => {
    setSearchFilters((prevState) => {
      return {
        ...prevState,
        pageSize: e.target.value,
      };
    });
  };

  const onEditContest = (contest) => {
    setEditMode(true);
    setInitialValues({
      id: contest.id,
      name: contest.firstName,
      organizer: contest.organizer,
      location: contest.lastName,
      startDate: contest.startDate,
      endDate: contest.endDate,
      status: contest.password,
    });
    setIsOpenModal(true);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      editMode ? await updateContest(values) : await createContest(values);
      setSubmitting(false);
      resetForm();
      setEditMode(false);
      setInitialValues({
        id: "",
        name: "",
        location: "",
        organizer: "1",
        startDate: "",
        endDate: "",
        status: "",
      });
      setIsOpenModal(false);
    } catch (error) {
      console.error(error);
      setSubmitting(false);
    }
  };

  const onCloseModal = () => {
    setIsOpenModal(false);
    setEditMode(false);
    setInitialValues({
      id: "",
      firstName: "",
      lastName: "",
      gender: "1",
      age: "",
      email: "",
      password: "",
    });
  };

  const onDeleteContest = (id) => {
    setDeleteContestId(id);
    setIsRemoveModalOpen(true);
  };

  const handleRemoveContest = async () => {
    try {
      await deleteContest(deleteContestId);
      setIsRemoveModalOpen(false);
      setDeleteContestId(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRefreshData = () => {
    setRefreshData(true);
    Notifies("success", "Datos actualizados correctamente");
  };

  const isEditpermissions = useCheckPermissions("edit_contest");
  const isCreatepermissions = useCheckPermissions("create_contest");
  const isDeletepermissions = useCheckPermissions("delete_contest");
  return (
    <div className="flex min-h-[77dvh] h-full flex-col gap-3 bg-white shadow-md rounded-md dark:bg-gray-900 p-3 antialiased">
      <TableHeader
        icon={HiCubeTransparent}
        title={"Competencias"}
        actions={[
          {
            label: "Nuevo",
            action: isCreatepermissions.hasPermission
              ? () => setIsOpenModal(true)
              : null,
            color: "mycad",
            icon: IoMdAdd,
            filled: true,
          },
        ]}
      />
      <TableActions
        onRefreshData={handleRefreshData}
        handleSearchTerm={handleSearch}
      />
      {contest && !isPending ? (
        contest?.data?.length > 0 ? (
            <div className="md:hidden py-2 flex flex-col gap-6">
              {contest?.data?.map((contest, index) => {
                const parseContest = {
                    name: {
                    key: "name",
                    value: contest.name,
                  },
                  organizer: {
                    key: "organizer",
                    value: contest.organizer,
                  },
                  startDate: {
                    key: "startDate",
                    value: contest.startDate,
                  },
                  endDate: {
                    key: "endDate",
                    value: contest.endDate,
                  },
                  location: {
                    key: "location",
                    value: contest.location,
                  },
                  status: {
                    key: "status",
                    value: contest.status,
                  },
                  actions: {
                    key: "Acciones",
                    value: (
                      <ActionButtons
                        onEdit={
                          isEditpermissions.hasPermission
                            ? () => onEditContest(contest)
                            : null
                        }
                        onRemove={
                          isDeletepermissions.hasPermission
                            ? () => onDeleteContest(contest.id)
                            : null
                        }
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
      {contest?.pagination && (
        <TableFooter
          pagination={contest?.pagination}
          goOnNextPage={goOnNextPage}
          goOnPrevPage={goOnPrevPage}
          handleSelectChange={handleSelectChange}
          changePageSize={changePageSize}
        />
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
      <ModalRemove
        isOpenModal={isRemoveModalOpen}
        onCloseModal={() => setIsRemoveModalOpen(false)}
        removeFunction={handleRemoveContest}
      />
    </div>
  );
};

const ProtectedContest = withPermission(Contest, "view_contest");

export default ProtectedContest;
