import React, { useState, useEffect } from 'react';
import { useRoleContext } from '../../context/RoleContext';
import TableHeader from '../../components/Table/TableHeader';
import { IoMdAdd } from 'react-icons/io';
import Accordion from '../../components/Accordion/Accordion';
import { FaChevronRight, FaUserShield } from 'react-icons/fa';
import { FiEdit } from 'react-icons/fi';
import classNames from 'classnames';
import { IoShieldSharp } from 'react-icons/io5';
import { PermissionsByGroup } from '../../utils/Permissions';
import { usePermissionContext } from '../../context/PermissionContext';
import { Dropdown, TextInput } from 'flowbite-react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import ModalFormikForm from '../../components/Modals/ModalFormikForm';
import { RoleFormSchema } from '../../components/Roles/RoleFormSchema';
import RoleFormFields from '../../components/Roles/RoleFormFields';
import ActionButtons from '../../components/ActionButtons/ActionButtons';
import { MdRemoveModerator } from 'react-icons/md';
import ModalRemove from '../../components/Modals/ModalRemove';
import withPermission from '../../utils/withPermissions';
import useCheckPermissions from '../../hooks/useCheckPermissions';

const Roles = () => {
  const {
    roles,
    useDeleteRole,
    useGetRoles,
    rolePermissions,
    useGetRolePermissionByRoleId,
    useCreateRolePermission,
    useDeleteRolePermission,
    useUpdateRole,
    useCreateRole,
  } = useRoleContext();
  const { permissions, useGetPermissions } = usePermissionContext();
  const [activeTab, setActiveTab] = useState(
    roles?.length > 0 ? roles[0]?.id : null,
  );
  const [isDisabled, setIsDisabled] = useState(false);
  const [groupedPermissions, setGroupedPermissions] = useState({});
  const [roleName, setRoleName] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const isCreateRolesPermission = useCheckPermissions('create_roles');
  const isEditRolesPermission = useCheckPermissions('edit_roles');
  const isDeleteRolesPermission = useCheckPermissions('delete_roles');

  useEffect(() => {
    useGetPermissions();
    useGetRoles();
  }, []);
  useEffect(() => {
    if (roles.length > 0 && activeTab) {
      getRolePermissionsByRoleId(activeTab);
      setRoleName(roles.find((role) => role.id === activeTab)?.name);
    }
  }, [activeTab]);

  const getRolePermissionsByRoleId = async (roleId) => {
    await useGetRolePermissionByRoleId(roleId);
  };

  useEffect(() => {
    if (permissions.length > 0) {
      const updatedPermissions = mapPermissionsToGroups(
        PermissionsByGroup,
        permissions,
      );
      setGroupedPermissions(updatedPermissions);
    }
  }, [permissions]);

  const changeActiveTab = (tab) => {
    setActiveTab(tab?.id);
    getRolePermissionsByRoleId(tab?.id);
    setRoleName(tab?.name);
  };

  const updateRolePermission = async (rolePermission, isChecked) => {
    setIsDisabled(true);
    if (isChecked) {
      await useCreateRolePermission({
        roleId: activeTab,
        permissionId: rolePermission.id,
      });
    } else {
      await useDeleteRolePermission({
        roleId: activeTab,
        permissionId: rolePermission.id,
      });
    }
    setTimeout(() => {
      setIsDisabled(false);
    }, 1000);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      editMode ? await useUpdateRole(values) : await useCreateRole(values);
      setSubmitting(false);
      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      console.log(error);
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setEditMode(false);
    setIsModalOpen(false);
  };

  const handleDeleteRole = async () => {
    try {
      await useDeleteRole(activeTab);
      setActiveTab(roles[0]?.id);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const mapPermissionsToGroups = (frontendPermissions, backendPermissions) => {
    const updatedGroups = {};

    Object.keys(frontendPermissions).forEach((groupKey) => {
      const group = frontendPermissions[groupKey];
      updatedGroups[groupKey] = {
        ...group,
        permissions: group.permissions.map((permissionName) => {
          const backendPermission = backendPermissions.find(
            (p) => p.name === permissionName,
          );

          return backendPermission
            ? { ...backendPermission }
            : {
                name: permissionName,
                id: null,
                description: 'Descripción no disponible',
              };
        }),
      };
    });

    return updatedGroups;
  };
  const handleContentTabs = () => {
    return Object.keys(groupedPermissions)
      .map((groupKey) => {
        const group = groupedPermissions[groupKey];

        return {
          title: group.name,
          content: (
            <div className="space-y-6">
              <div className="grid gap-2 grid-cols-1" key={groupKey}>
                {group.permissions.map((permission) => (
                  <label
                    key={permission.id || permission.name}
                    className="flex items-center gap-2 hover:bg-neutral-100 group-hover:bg-neutral-100 p-2 rounded-md cursor-pointer"
                  >
                    {isDeleteRolesPermission.hasPermission ? (
                      <TextInput
                        color={'warning'}
                        type="checkbox"
                        name={permission.name}
                        value={permission.name}
                        disabled={
                          isDisabled || !isDeleteRolesPermission.hasPermission
                        }
                        checked={
                          !!rolePermissions?.find(
                            (p) => p?.permissionId === permission?.id,
                          )
                        }
                        onChange={(e) =>
                          updateRolePermission(permission, e.target.checked)
                        }
                      />
                    ) : (
                      <TextInput
                        color={'warning'}
                        type="checkbox"
                        name={permission.name}
                        value={permission.name}
                        disabled={
                          isDisabled || !isDeleteRolesPermission.hasPermission
                        }
                        checked={
                          !!rolePermissions?.find(
                            (p) => p?.permissionId === permission?.id,
                          )
                        }
                        onChange={null}
                      />
                    )}
                    <span className="text-sm lg:text-base">
                      {permission.description}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ),
        };
      })
      .sort((a, b) => a.title.localeCompare(b.title));
  };

  return (
    <>
      <section className="flex flex-col gap-3 min-h-full h-full bg-white shadow-md rounded-md dark:bg-neutral-900 p-3 pb-0 antialiased">
        <TableHeader
          title="Control de Roles"
          icon={FaUserShield}
          actions={[
            {
              label: 'Agregar Rol',
              action: isCreateRolesPermission.hasPermission
                ? () => setIsModalOpen(true)
                : null,
              color: 'mycad',
              icon: IoMdAdd,
              filled: true,
            },
          ]}
        />
        <div className="h-full grid grid-cols-3 gap-8 p-2 pt-4 pb-0">
          <div className="col-span-3 lg:col-span-1">
            <div className="mb-4">
              <h3 className="text-sm lg:text-lg font-semibold">Roles</h3>
              <p className="text-sm text-neutral-500">
                Selecciona un rol para ver sus permisos
              </p>
            </div>
            {roles
              ?.sort((a, b) => a.name.localeCompare(b.name))
              .map((role) => (
                <div
                  key={role.id}
                  onClick={() => changeActiveTab(role)}
                  className={classNames(
                    'group p-4 hover:bg-neutral-100 text-neutral-700 border-b border-neutral-100 cursor-pointer flex justify-between items-center',
                    activeTab == role.id
                      ? 'bg-neutral-50 '
                      : 'text-neutral-500',
                  )}
                >
                  <div className="flex gap-4 items-center">
                    <IoShieldSharp size={20} />
                    <h3 className="text-sm lg:text-lg font-semibold">
                      {role.name}
                    </h3>
                  </div>
                  <i
                    className={classNames(
                      'group-hover:text-neutral-800 transition-all duration-200',
                      activeTab == role?.id ? '' : 'text-white',
                    )}
                  >
                    <FaChevronRight size={18} className="text-lg mt-0.5" />
                  </i>
                </div>
              ))}
          </div>
          <div className="col-span-3 lg:col-span-2 h-full lg:max-h-[76dvh] overflow-hidden">
            <div className="mb-4 flex justify-between">
              <div>
                <h3 className="text-sm lg:text-lg font-semibold">
                  Permisos del rol&nbsp;{roleName}
                </h3>
                <p className="text-sm text-neutral-500">
                  Selecciona una vista para administrar los permisos del rol
                  seleccionado
                </p>
              </div>
              {(isDeleteRolesPermission.hasPermission ||
                isEditRolesPermission.hasPermission) && (
                <Dropdown
                  label={
                    <BsThreeDotsVertical
                      size={36}
                      className="p-2 rounded-full hover:bg-neutral-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                    />
                  }
                  dismissOnClick={false}
                  inline
                  arrowIcon={null}
                >
                  {isEditRolesPermission.hasPermission && (
                    <ActionButtons
                      extraActions={[
                        {
                          label: 'Editar rol',
                          action: () => {
                            setEditMode(true);
                            setIsModalOpen(true);
                          },
                          color: 'transparent',
                          icon: FiEdit,
                          className:
                            'md:min-w-full border-none hover:bg-neutral-100',
                        },
                      ]}
                    />
                  )}
                  {isDeleteRolesPermission.hasPermission && (
                    <ActionButtons
                      extraActions={[
                        {
                          label: 'Eliminar rol',
                          action: () => setIsDeleteModalOpen(true),
                          color: 'transparent',
                          filled: true,
                          icon: MdRemoveModerator,
                          className:
                            'md:min-w-full border-none hover:bg-neutral-100',
                        },
                      ]}
                    />
                  )}
                </Dropdown>
              )}
            </div>
            <div className="overflow-y-auto h-full md:max-h-[69dvh] w-full">
              {activeTab && <Accordion data={handleContentTabs() ?? []} />}
            </div>
          </div>
        </div>
      </section>
      {isModalOpen && (
        <ModalFormikForm
          onClose={closeModal}
          dismissible
          isOpenModal={isModalOpen}
          title={editMode ? 'Editar Rol' : 'Crear Rol'}
          schema={RoleFormSchema}
          initialValues={
            editMode
              ? {
                  name: roleName,
                  id: activeTab,
                }
              : {
                  name: '',
                  id: '',
                }
          }
          onSubmit={handleSubmit}
          formFields={<RoleFormFields />}
          saveLabel={editMode ? 'Actualizar Rol' : 'Crear Rol'}
        />
      )}
      {isDeleteModalOpen && (
        <ModalRemove
          isOpenModal={isDeleteModalOpen}
          onCloseModal={() => setIsDeleteModalOpen(false)}
          removeFunction={handleDeleteRole}
        />
      )}
    </>
  );
};

const ProtectedRolesView = withPermission(Roles, 'view_roles');

export default React.memo(ProtectedRolesView);
