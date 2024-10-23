import React from 'react';
import { Field } from 'formik';
import TextInput from '../../Inputs/TextInput';
import { MdOutlinePassword } from 'react-icons/md';

const ChangePasswordFormFields = () => {
  return (
    <div className="flex flex-col gap-4">
      <Field
        name="currentPassword"
        id="currentPassword"
        label="Contraseña actual"
        component={TextInput}
        icon={MdOutlinePassword}
        type="password"
      />
      <Field
        name="newPassword"
        id="newPassword"
        label="Nueva contraseña"
        component={TextInput}
        icon={MdOutlinePassword}
        type="password"
      />
      <Field
        name="confirmNewPassword"
        id="confirmNewPassword"
        label="Confirmar nueva contraseña"
        component={TextInput}
        icon={MdOutlinePassword}
        type="password"
      />
    </div>
  );
};

export default ChangePasswordFormFields;
