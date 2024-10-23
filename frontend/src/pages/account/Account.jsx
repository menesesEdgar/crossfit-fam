import React, { useState, useRef, useEffect } from 'react';
import { useAuthContext } from '../../context/AuthContext';
// import ImageViewer from '../../components/ImageViewer/ImageViewer';
import ActionButtons from '../../components/ActionButtons/ActionButtons';
import { RiImageEditLine, RiLockPasswordFill } from 'react-icons/ri';
import { MdImageSearch, MdPassword } from 'react-icons/md';
import { LuImageOff } from 'react-icons/lu';
import AccountFields from '../../components/AccountFields/AccountFields';
import ModalForm from '../../components/Modals/ModalForm';
import ChangePasswordForm from '../../components/AccountFields/ChangePassword/ChangePasswordForm';
import { FaSave } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { AiFillEdit } from 'react-icons/ai';
import withPermission from '../../utils/withPermissions';
import useCheckPermissions from '../../hooks/useCheckPermissions';

const Account = () => {
  const inputRef = useRef(null);
  const { user, updateProfileImage, updateProfile, updatePassword } =
    useAuthContext();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [extraActions, setExtraActions] = useState([]);
  const [image, setImage] = useState(user?.photo || '');
  const [userFields, setUserFields] = useState([]);
  const [passwordFields, setPasswordFields] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (image && image instanceof File && image !== user?.photo) {
      setExtraActions([
        {
          label: 'Descartar cambios',
          icon: LuImageOff,
          action: () => setImage(user?.photo || ''),
          color: 'red',
        },
        {
          label: 'Guardar cambios',
          icon: RiImageEditLine,
          action: () => handleImageUpload(),
          filled: image ? true : false,
          color: 'mycad',
        },
      ]);
    } else {
      setExtraActions([
        {
          label: 'Seleccionar imagen',
          icon: MdImageSearch,
          action: () => inputRef.current.click(),
          color: 'stone',
        },
      ]);
    }
  }, [image]);

  useEffect(() => {
    setUserFields([
      {
        id: 'firstName',
        label: 'Nombre',
        name: 'firstName',
        value: user.firstName,
        onChange: handleFieldChange,
        allowEdit: true,
      },
      {
        id: 'lastName',
        label: 'Apellidos',
        name: 'lastName',
        value: user.lastName,
        onChange: handleFieldChange,
        allowEdit: true,
      },
      {
        id: 'email',
        label: 'Correo electrónico',
        name: 'email',
        value: user.email,
        onChange: handleFieldChange,
        allowEdit: user.role.name === 'Admin' ? true : false,
      },
      {
        id: 'phone',
        label: 'Teléfono',
        name: 'phone',
        value: user.phone,
        onChange: handleFieldChange,
        allowEdit: true,
        inputType: 'tel',
      },
    ]);
  }, [user]);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setUserFields((prev) => {
      return prev.map((field) => {
        if (field.name === name) {
          return { ...field, value };
        }

        return field;
      });
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    setImage(file);
  };

  const handleImageUpload = async () => {
    if (image && image instanceof File) {
      const res = await updateProfileImage(image);
      if (res) {
        setImage(res.photo);
      }
    }
  };

  const onSaveFieldChanges = () => {
    const data = userFields.reduce((acc, field) => {
      return { ...acc, [field.name]: field.value };
    }, {});
    updateProfile({ ...data, userId: user.id });
    setIsEditing(false);
  };

  const handleDiscardFieldChanges = () => {
    setUserFields((prev) => {
      return prev.map((field) => {
        return { ...field, value: user[field.name] };
      });
    });
    setIsEditing(false);
  };

  const onChangePassword = async (values, { setSubmitting, resetForm }) => {
    try {
      await updatePassword(values);
      setSubmitting(false);
      resetForm();
      setPasswordFields({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
      setIsOpenModal(false);
      setError(null);
    } catch (error) {
      console.log(error);
      setError(
        error.response?.data?.message || 'Error al actualizar la contraseña',
      );
      setSubmitting(false);
    }
  };

  const isEditAccountPermission = useCheckPermissions('edit_account');
  const isChangePassPermission = useCheckPermissions('change_password');
  const isUpdateImagePermission = useCheckPermissions('change_account_image');

  return (
    <div className="flex flex-col gap-6">
      <section className="bg-white shadow-md p-4 rounded-lg">
        <h1 className="text-2xl font-bold text-orange-500 mb-2">Mi cuenta</h1>
        {/* <form className="flex flex-col items-center justify-center gap-4">
          <div className="flex justify-start w-full">
            <h2 className="text-lg font-semibold">Imagen del perfil</h2>
            {isUpdateImagePermission.hasPermission && (
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg, image/png, image/jpg, image/webp"
                hidden
                className="hidden"
                onChange={handleImageChange}
              />
            )}
          </div>
          <div className="rounded-full h- ring-4 ring-orange-500 p-1.5">
            <ImageViewer
              containerClassNames={'rounded-full overflow-hidden'}
              images={image ? [image] : []}
            />
          </div>
          {isUpdateImagePermission.hasPermission && (
            <div className="flex flex-col md:flex-row justify-start gap-2">
              <ActionButtons extraActions={extraActions} />
            </div>
          )}
        </form> */}
        {/* <hr className="my-4" /> */}
        <form>
          <h2 className="text-lg font-bold mb-4">Información de la cuenta</h2>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            {user &&
              userFields.map((field) => {
                return (
                  <AccountFields
                    key={field.id}
                    id={field.id}
                    label={field.label}
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    allowEdit={field.allowEdit}
                    isEditing={isEditing}
                    inputType={field?.inputType}
                  />
                );
              })}
          </div>
          <div className="flex flex-col md:flex-row justify-end gap-4 mt-4">
            {isEditing ? (
              <ActionButtons
                extraActions={[
                  {
                    label: 'Descartar cambios',
                    icon: IoMdClose,
                    action: handleDiscardFieldChanges,
                    color: 'red',
                  },
                  {
                    label: 'Guardar cambios',
                    icon: FaSave,
                    action: onSaveFieldChanges,
                    color: 'mycad',
                    filled: true,
                  },
                ]}
              />
            ) : (
              <ActionButtons
                extraActions={[
                  {
                    label: 'Editar',
                    icon: AiFillEdit,
                    action: isEditAccountPermission.hasPermission
                      ? () => setIsEditing(true)
                      : null,
                    color: 'stone',
                  },
                ]}
              />
            )}
          </div>
        </form>
        <hr className="my-4" />
        {isChangePassPermission.hasPermission && (
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-bold">
              <span className="inline-block mr-2">
                <RiLockPasswordFill size={20} />
              </span>
              Cambiar contraseña
            </h2>
            <ActionButtons
              extraActions={[
                {
                  label: 'Cambiar contraseña',
                  icon: MdPassword,
                  action: () => setIsOpenModal(true),
                  color: 'stone',
                  filled: true,
                },
              ]}
            />
            {isOpenModal && (
              <ModalForm
                isOpenModal={isOpenModal}
                onClose={() => setIsOpenModal(false)}
                title={'Cambiar contraseña'}
                size={'xl'}
              >
                <ChangePasswordForm
                  initialValues={passwordFields}
                  onSubmit={onChangePassword}
                  error={error}
                />
              </ModalForm>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

const ProtectedAccountView = withPermission(Account, 'view_account');

export default ProtectedAccountView;
