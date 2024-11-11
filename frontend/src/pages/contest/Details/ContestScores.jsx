import React, { useCallback, useEffect, useRef, useState } from "react";
import { useUserContext } from "../../../context/UserContext";
import { useQuery } from "@tanstack/react-query";
import Skeleton from "react-loading-skeleton";
import { IoMdAdd } from "react-icons/io";
import { Table as T } from "flowbite-react";
import ModalRemove from "../../../components/Modals/ModalRemove";
import { searchUsers } from "../../../services/api";
import usersColumns from "../../../utils/usersColumns";
import ActionButtons from "../../../components/ActionButtons/ActionButtons";
import Notifies from "../../../components/Notifies/Notifies";
import ImageViewer from "../../../components/ImageViewer/ImageViewer";
import { useAuthContext } from "../../../context/AuthContext";
import { FaLock, FaUserShield } from "react-icons/fa";
import { useRoleContext } from "../../../context/RoleContext";
import ModalFormikForm from "../../../components/Modals/ModalFormikForm";
import {
  UserFormChangePasswordSchema,
  UserFormSchema,
  UserFormUpdateSchema,
} from "../../../components/Users/UserFormSchema";
import UserFormFields from "../../../components/Users/UserFormFields";
import withPermission from "../../../utils/withPermissions";
import useCheckPermissions from "../../../hooks/useCheckPermissions";
import { useContestContext } from "../../../context/ContestContext";
const Card = React.lazy(() => import("../../../components/Card/Card"));
const TableHeader = React.lazy(() =>
  import("../../../components/Table/TableHeader")
);
const TableFooter = React.lazy(() =>
  import("../../../components/Table/TableFooter")
);
const TableActions = React.lazy(() =>
  import("../../../components/Table/TableActions")
);
const TableResultsNotFound = React.lazy(() =>
  import("../../../components/Table/TableResultsNotFound")
);
const columns = [
    {
        id: 'id',
        value: '#',
        order: 'asc',
        type: 'text',
    },
    {
        id: 'athlete',
        value: 'Atleta',
        order: 'asc',
        type: 'text',
    },
]
const ContestScores = () => {
  const [columns, setColumns] = useState(usersColumns);
  const isCreateUserPermission = useCheckPermissions("create_users");
  const isEditUserPermission = useCheckPermissions("edit_users");
  const isRemoveUserPermission = useCheckPermissions("delete_users");
  const {
    
  } = useContestContext()
  const users =[];
  const isPending = false;
    return (
        <div className="flex flex-col gap-3 bg-white shadow-md rounded-md dark:bg-gray-900 p-3 antialiased">
          <TableHeader
            title={"Puntuaciones"}
            icon={FaUserShield}
          />
          <TableActions
            handleSearchTerm={() => {}}
            headers={columns}
          />
          {users && !isPending ? (
            users?.data?.length > 0 ? (
              <>
                <div className="hidden md:block text-nowrap">
                  <Table
                    columns={columns}
                    sortBy={sortBy}
                  >
                    {users?.data?.map((user) => {
                      const formatedUser = {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        phone: user.phone,
                        "role.name": user.role.name,
                        photo: user?.photo?.[0] ? [user.photo?.[0]] : [],
                        status: user.status,
                      };
                      return (
                        <T.Row key={user.id}>
                          {columns.map((column) =>
                            column.id === "photo" ? (
                              <T.Cell key={column.id}>
                                {formatedUser[column.id] &&
                                formatedUser[column.id].length > 0 ? (
                                  <ImageViewer
                                    containerClassNames={
                                      "first:w-12 first:h-12 first:rounded-md"
                                    }
                                    images={formatedUser[column.id]}
                                    alt={`${formatedUser.firstName} ${formatedUser.lastName}`}
                                  />
                                ) : (
                                  <div className="h-12 w-12 rounded-lg bg-stone-200 flex justify-center items-center gap-2">
                                    <span className="text-stone-500 font-bold text-2xl">
                                      {formatedUser.firstName[0] +
                                        formatedUser.lastName[0]}
                                    </span>
                                  </div>
                                )}
                              </T.Cell>
                            ) : column.id === "firstName" ||
                              column.id === "lastName" ||
                              column.id === "email" ||
                              column.id === "phone" ||
                              column.id === "role.name" ? (
                              <T.Cell
                                className={`${
                                  column?.id === "firstName" ? "font-bold" : ""
                                }`}
                                key={column.id}
                              >
                                {formatedUser[column.id]}
                              </T.Cell>
                            ) : column.id === "status" ? (
                              <T.Cell key={column.id}>
                                <span
                                  className={classNames(
                                    "text-xs font-bold px-4 py-2 rounded-full",
                                    formatedUser[column.id] === "Habilitado"
                                      ? "bg-crossfit-success text-white"
                                      : formatedUser[column.id] === "Deshabilitado"
                                      ? "bg-crossfit-danger text-white"
                                      : "bg-crossfit-warning text-white"
                                  )}
                                >
                                  {formatedUser[column.id]}
                                </span>
                              </T.Cell>
                            ) : column.id === "actions" && sesionUser ? (
                              <T.Cell key={column?.id}>
                                <div className="flex justify-center items-center gap-2">
                                  <ActionButtons
                                    onEdit={
                                      isEditUserPermission.hasPermission
                                        ? () => onEditUser(user)
                                        : null
                                    }
                                  />
                                </div>
                              </T.Cell>
                            ) : null
                          )}
                        </T.Row>
                      );
                    })}
                  </Table>
                </div>
              </>
            ) : (
              <TableResultsNotFound />
            )
          ) : (
            <Skeleton count={5} className="h-10" />
          )}
          {/* {isOpenModal && (
            <ModalFormikForm
              onClose={onCloseModal}
              isOpenModal={isOpenModal}
              dismissible
              title={editMode ? "Editar Usuario" : "Crear Nuevo Usuario"}
              size={"3xl"}
              schema={editMode ? UserFormUpdateSchema : UserFormSchema}
              initialValues={initialValues}
              onSubmit={handleSubmit}
              formFields={<UserFormFields editMode={editMode} roles={roles} />}
              saveLabel={editMode ? "Actualizar" : "Guardar"}
            />
          )} */}
        </div>
      );
    };
    
    const ProtectedContestScoresView = withPermission(ContestScores, "view_contest");
    
    export default ProtectedContestScoresView;