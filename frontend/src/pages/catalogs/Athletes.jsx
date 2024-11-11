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
import { FaEyeSlash, FaLock, FaUsers } from "react-icons/fa";
import { calculateAge } from "../../utils/formatDates";
import ModalViewer from "../../components/Modals/ModalViewer";
import { MdContentCopy } from "react-icons/md";
import ArmImage from "../../assets/images/arm.webp";
import { FaEye } from "react-icons/fa6";
import { useUserContext } from "../../context/UserContext";
import { UserFormChangePasswordSchema } from "../../components/Users/UserFormSchema";
import UserChangePasswordFormFields from "../../components/Users/UserChangePasswordFormFields";
import classNames from "classnames";

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
    id: "status",
    value: "Estado",
    order: "asc",
  },
  {
    id: "actions",
    value: "Acciones",
    type: "actions",
    classes: "text-center",
  },
];

const initiValues = {
  firstName: "",
  lastName: "",
  birthDate: "",
  gender: "",
  email: "",
  phone: "",
  role: "Athlete",
  status: "",
  id: "",
};

const Athletes = () => {
  const { useChangePasswordUser } = useUserContext();
  const { createAthlete, updateAthlete, deleteAthlete } = useCatalogContext();
  const [columns, setColumns] = useState([...athletesColumns]);
  const lastChange = useRef();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [deleteAthleteId, setDeleteAthleteId] = useState(null);
  const [isOpenModalViewer, setIsOpenModalViewer] = useState(false);
  const [newAtlhete, setNewAthlete] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const [initialPasswordValues, setInitialPasswordValues] = useState({
    id: "",
    password: "",
    repeatPassword: "",
  });
  const [initialValues, setInitialValues] = useState({
    ...initiValues,
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
    setEditMode(true);
    setInitialValues({
      id: athlete.id,
      firstName: athlete.firstName,
      lastName: athlete.lastName,
      gender: athlete?.gender ? athlete.gender : "",
      birthDate: athlete?.birthdate ? athlete.birthdate.split("T")[0] : "",
      email: athlete.email,
      phone: athlete.phone,
      status: athlete.status,
      role: athlete?.roleId,
    });
    setIsOpenModal(true);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const res = editMode
        ? await updateAthlete(values)
        : await createAthlete(values);
      setSubmitting(false);
      resetForm();
      if (!editMode) {
        setNewAthlete(res);
        setIsOpenModalViewer(true);
      }
      setEditMode(false);
      setInitialValues({
        ...initiValues,
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
      ...initiValues,
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

  const onChangeAthletePassword = async (
    values,
    { setSubmitting, resetForm }
  ) => {
    try {
      await useChangePasswordUser(values);
      setSubmitting(false);
      resetForm();
      setInitialValues({
        id: "",
        password: "",
        repeatPassword: "",
      });
      setChangePasswordModal(false);
    } catch (err) {
      console.log("error on submit change password", err);
      Notifies("error", "Error al cambiar la contraseña del usuario");
    }
  };

  return (
    <div className="flex h-full flex-col gap-3 p-3 antialiased">
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
            <div className="hidden md:block text-nowrap">
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
                          } else if (column.id === "status") {
                            cellValue = athlete.status;
                          }

                          if (cellValue !== undefined) {
                            return (
                              <T.Cell
                                className={`${
                                  column?.id === "athlete" ? "font-bold" : ""
                                }`}
                                key={column.id}
                              >
                                {column?.id === "status" ? (
                                  <span
                                    className={classNames(
                                      "text-xs font-bold px-4 py-2 rounded-full",
                                      athlete?.status === "Habilitado"
                                        ? "bg-crossfit-success text-white"
                                        : athlete?.status === "Deshabilitado"
                                        ? "bg-crossfit-danger text-white"
                                        : "bg-crossfit-warning text-white"
                                    )}
                                  >
                                    {athlete?.status}
                                  </span>
                                ) : (
                                  cellValue
                                )}
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
                                  extraActions={[
                                    {
                                      label: "Cambiar contraseña",
                                      action: isEditpermissions.hasPermission
                                        ? () => {
                                            setInitialPasswordValues({
                                              id: athlete?.id,
                                              password: "",
                                              repeatPassword: "",
                                            });
                                            setChangePasswordModal(true);
                                          }
                                        : null,
                                      color: "indigo",
                                      icon: FaLock,
                                    },
                                  ]}
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
          formFields={<AthleteFormFields editMode={editMode} />}
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
      {isOpenModalViewer && (
        <ModalViewer
          isOpenModal={isOpenModalViewer}
          onCloseModal={() => {
            setIsOpenModalViewer(false);
            setNewAthlete(null);
          }}
          title="Registro completado"
          size="lg"
        >
          <div className="flex flex-col items-start justify-start w-full p-4 gap-4">
            <div className="flex justify-center items-center flex-col-reverse gap-4 w-full ">
              <p className="text-xl text-center font-semibold text-crossfit-primary">
                El atleta ha sido registrado correctamente.
              </p>
              <img
                src={ArmImage}
                alt="Arm"
                className="w-32 h-32 object-cover rounded-full ring-4 ring-crossfit-primary"
              />
            </div>
            <div className="flex flex-col gap-3">
              <p>
                <span className="font-bold">Nombre:</span>{" "}
                {newAtlhete?.firstName} {newAtlhete?.lastName}
              </p>
              <p>
                <span className="font-bold">Email:</span> {newAtlhete?.email}
              </p>
              <p className="flex items-center gap-2">
                <span className="font-bold">Contraseña:</span>{" "}
                {showPassword ? newAtlhete?.password : "**********"}
                <span
                  onClick={() => {
                    navigator.clipboard.writeText(newAtlhete?.password);
                    Notifies("success", "Contraseña copiada al portapapeles");
                  }}
                  className="flex items-center justify-center cursor-pointer  rounded-md text-sm text-neutral-500 bg-neutral-200 p-2"
                >
                  <MdContentCopy size={18} />
                </span>
              </p>
              <ActionButtons
                extraActions={[
                  {
                    label: showPassword
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña",
                    action: showPassword
                      ? () => setShowPassword(false)
                      : () => setShowPassword(true),
                    color: "crossfit",
                    icon: showPassword ? FaEyeSlash : FaEye,
                  },
                ]}
              />
            </div>
          </div>
        </ModalViewer>
      )}
      {changePasswordModal && (
        <ModalFormikForm
          onClose={() => setChangePasswordModal(false)}
          isOpenModal={changePasswordModal}
          dismissible
          title={`Cambiar contraseña de ${
            athletes?.data?.find(
              (user) => user?.id === initialPasswordValues?.id
            )?.firstName
          }
          ${
            athletes?.data?.find(
              (user) => user?.id === initialPasswordValues?.id
            )?.lastName
          }`}
          size={"xl"}
          schema={UserFormChangePasswordSchema}
          initialValues={initialPasswordValues}
          onSubmit={onChangeAthletePassword}
          formFields={<UserChangePasswordFormFields />}
          saveLabel={editMode ? "Actualizar" : "Guardar"}
        />
      )}
    </div>
  );
};

const ProtectedAthletes = withPermission(Athletes, "view_athletes");

export default ProtectedAthletes;
