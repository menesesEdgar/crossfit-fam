import React, { useCallback, useEffect, useRef, useState, lazy } from "react";

import Skeleton from "react-loading-skeleton";
import { useQuery } from "@tanstack/react-query";
import { IoMdAdd } from "react-icons/io";
import { Table as T } from "flowbite-react";
import { useCatalogContext } from "../../context/CatalogContext";
import ModalRemove from "../../components/Modals/ModalRemove";
import { searchUsers as searchAthletes } from "../../services/api";
import ActionButtons from "../../components/ActionButtons/ActionButtons";
import Notifies from "../../components/Notifies/Notifies";
import AthleteFormFields from "../../components/AthleteComponents/AthleteFormFields";
import ModalFormikForm from "../../components/Modals/ModalFormikForm";
import { AthleteFormSchema } from "../../components/AthleteComponents/AthleteFormSchema";
import withPermission from "../../utils/withPermissions";
import useCheckPermissions from "../../hooks/useCheckPermissions";
import { FaUsers } from "react-icons/fa";
import { calculateAge } from "../../utils/formatDates";
const Card = lazy(() => import("../../components/Card/Card"));
const TableHeader = lazy(() => import("../../components/Table/TableHeader"));
const TableFooter = lazy(() => import("../../components/Table/TableFooter"));
const TableActions = lazy(() => import("../../components/Table/TableActions"));
const TableResultsNotFound = lazy(() =>
  import("../../components/Table/TableResultsNotFound")
);
const Table = lazy(() => import("../../components/Table/Table"));
export const athletesColumns = [
  {
    id: "firstName",
    value: "Nombre",
    order: "asc",
    type: "text",
  },
  {
    id: "lastName",
    value: "Apellido",
    order: "asc",
    type: "text",
  },
  {
    id: "email",
    value: "Email",
    order: "asc",
    type: "text",
  },
  {
    id: "birthdate",
    value: "Edad",
    order: "asc",
    type: "number",
    classes: "text-center",
  },
  {
    id: "gender",
    value: "Género",
    order: "asc",
    type: "text",
  },
  {
    id: "actions",
    value: "Acciones",
    type: "actions",
    classes: "text-center",
  },
];
const Athletes = () => {
  const { createAthlete, updateAthlete, deleteAthlete } = useCatalogContext();
  const [columns, setColumns] = useState([...athletesColumns]);
  const lastChange = useRef();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [deleteAthleteId, setDeleteAthleteId] = useState(null);
  const [initialValues, setInitialValues] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    gender: "",
    email: "",
    phone: "",
    role: "Athlete",
    id: "",
  });
  const [refreshData, setRefreshData] = useState(false);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [searchFilters, setSearchFilters] = useState({
    searchTerm: "",
    pageSize: 5,
    page: currentPageNumber,
    sortBy: "firstName",
    order: "asc",
    role: "Athlete",
  });

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

  const sortBy = (column) => {
    const selectedHeaderIndex = columns?.findIndex((col) => col.id === column);
    let updatedHeaders = [];
    if (selectedHeaderIndex !== -1) {
      const selectedHeader = columns[selectedHeaderIndex];
      const updatedHeader = {
        ...selectedHeader,
        order: selectedHeader?.order === "asc" ? "desc" : "asc",
      };
      updatedHeaders = [...columns];
      updatedHeaders[selectedHeaderIndex] = updatedHeader;
      setSearchFilters((prevState) => {
        return {
          ...prevState,
          sortBy: column,
          order: updatedHeader?.order,
        };
      });
    }
    setColumns(updatedHeaders);
  };

  const onEditAthlete = (athlete) => {
    console.log("first ", athlete);
    setEditMode(true);
    setInitialValues({
      id: athlete.id,
      firstName: athlete.firstName,
      lastName: athlete.lastName,
      gender: athlete?.gender ? athlete.gender : "",
      birthDate: athlete?.birthdate ? athlete.birthdate.split("T")[0] : "",
      email: athlete.email,
      phone: athlete.phone,
      role: athlete?.roleId,
    });
    setIsOpenModal(true);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    console.log("values ", values);
    try {
      editMode ? await updateAthlete(values) : await createAthlete(values);
      setSubmitting(false);
      resetForm();
      setEditMode(false);
      setInitialValues({
        id: "",
        firstName: "",
        lastName: "",
        gender: "",
        birthDate: "",
        email: "",
        phone: "",
        role: "Athlete",
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
      gender: "",
      birthDate: "",
      email: "",
      phone: "",
      role: "Athlete",
    });
  };

  const onDeleteAthlete = (id) => {
    setDeleteAthleteId(id);
    setIsRemoveModalOpen(true);
  };

  const handleRemoveAthlete = async () => {
    try {
      await deleteAthlete(deleteAthleteId);
      setIsRemoveModalOpen(false);
      setDeleteAthleteId(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRefreshData = () => {
    setRefreshData(true);
    Notifies("success", "Datos actualizados correctamente");
  };

  const isEditpermissions = useCheckPermissions("edit_athlete");
  const isCreatepermissions = useCheckPermissions("create_athlete");
  const isDeletepermissions = useCheckPermissions("delete_athlete");
  return (
    <div className="flex min-h-[77dvh] h-full flex-col gap-3 dark:bg-gray-900 p-3 antialiased">
      <TableHeader
        icon={FaUsers}
        title={"Atletas"}
        actions={[
          {
            label: "Nuevo",
            action: isCreatepermissions.hasPermission
              ? () => setIsOpenModal(true)
              : null,
            color: "crossfit",
            icon: IoMdAdd,
            filled: true,
          },
        ]}
      />
      <TableActions
        onRefreshData={handleRefreshData}
        handleSearchTerm={handleSearch}
        headers={columns}
      />
      {athletes && !isPending ? (
        athletes?.data?.length > 0 ? (
          <>
            <div className="hidden md:block">
              <Table
                columns={columns}
                sortBy={sortBy}
                sortedBy={searchFilters.sortBy}
              >
                {athletes &&
                  !isPending &&
                  athletes?.data?.map((athlete) => {
                    return (
                      <T.Row key={athlete.id}>
                        {columns.map((column) => {
                          let cellValue;
                          if (column.id === "firstName") {
                            cellValue = athlete.firstName;
                          } else if (column.id === "lastName") {
                            cellValue = athlete.lastName;
                          } else if (column.id === "email") {
                            cellValue = athlete.email;
                          } else if (column.id === "birthdate") {
                            cellValue = athlete?.birthdate
                              ? calculateAge(athlete.birthdate) + " años"
                              : "";
                          } else if (column.id === "gender") {
                            cellValue = athlete.gender;
                          }

                          if (cellValue !== undefined) {
                            return (
                              <T.Cell
                                className={`${
                                  column?.id === "athlete" ? "font-bold" : ""
                                }`}
                                key={column.id}
                              >
                                {cellValue}
                              </T.Cell>
                            );
                          }

                          return (
                            <T.Cell key={column?.id}>
                              <div className="flex justify-center items-center gap-2">
                                <ActionButtons
                                  onEdit={
                                    isEditpermissions.hasPermission
                                      ? () => onEditAthlete(athlete)
                                      : null
                                  }
                                  onRemove={
                                    isDeletepermissions.hasPermission
                                      ? () => onDeleteAthlete(athlete.id)
                                      : null
                                  }
                                />
                              </div>
                            </T.Cell>
                          );
                        })}
                      </T.Row>
                    );
                  })}
              </Table>
            </div>
            <div className="md:hidden h-fit overflow-y-auto py-2 flex flex-col gap-6">
              {athletes?.data?.map((athlete, index) => {
                const parseAthlete = {
                  firstName: {
                    key: "Nombre",
                    value: athlete.firstName,
                  },
                  lastName: {
                    key: "Apellidos",
                    value: athlete.lastName,
                  },
                  gender: {
                    key: "Genero",
                    value: athlete.gender,
                  },
                  birthdate: {
                    key: "Edad",
                    value: athlete?.birthdate
                      ? calculateAge(athlete.birthdate) + " años"
                      : "",
                  },
                  actions: {
                    key: "Acciones",
                    value: (
                      <ActionButtons
                        onEdit={
                          isEditpermissions.hasPermission
                            ? () => onEditAthlete(athlete)
                            : null
                        }
                        onRemove={
                          isDeletepermissions.hasPermission
                            ? () => onDeleteAthlete(athlete.id)
                            : null
                        }
                      />
                    ),
                  },
                };
                return <Card key={athlete.id} data={parseAthlete} />;
              })}
            </div>
          </>
        ) : (
          <TableResultsNotFound />
        )
      ) : (
        <Skeleton count={10} className="h-10" />
      )}
      {athletes?.pagination && (
        <TableFooter
          pagination={athletes?.pagination}
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
          title={editMode ? "Editar Atleta" : "Registra Atleta"}
          schema={AthleteFormSchema}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          formFields={<AthleteFormFields />}
          saveLabel={editMode ? "Actualizar" : "Guardar"}
        />
      )}
      {isRemoveModalOpen && (
        <ModalRemove
          isOpenModal={isRemoveModalOpen}
          onCloseModal={() => setIsRemoveModalOpen(false)}
          removeFunction={handleRemoveAthlete}
        />
      )}
    </div>
  );
};

const ProtectedAthletes = withPermission(Athletes, "view_athletes");

export default ProtectedAthletes;
