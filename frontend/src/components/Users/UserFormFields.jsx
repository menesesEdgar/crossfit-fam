import React from "react";
import { Field } from "formik";
import TextInput from "../Inputs/TextInput";
import SelectInput from "../Inputs/SelectInput";
import { BiUser } from "react-icons/bi";
import { FaEnvelope } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { PiUserCircleCheckBold } from "react-icons/pi";

const UserFormFields = ({ editMode }) => {
  return (
    <div className="grid gap-4 grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))]">
      <Field
        name="firstName"
        id="firstName"
        component={TextInput}
        label="Nombre"
        type="text"
        icon={BiUser}
      />
      <Field
        name="lastName"
        id="lastName"
        component={TextInput}
        label="Apellido"
        type="text"
        icon={BiUser}
      />
      <Field
        name="email"
        id="email"
        component={TextInput}
        label="Correo Electrónico"
        type="email"
        icon={FaEnvelope}
      />
      <Field
        name="phone"
        id="phone"
        component={TextInput}
        label="Teléfono"
        type="tel"
        icon={FaPhoneAlt}
      />
      {!editMode && (
        <Field
          name="password"
          id="password"
          component={TextInput}
          label="Contraseña"
          type="password"
          icon={FaLock}
        />
      )}
      {!editMode && (
        <Field
          name="repeatPassword"
          id="repeatPassword"
          component={TextInput}
          label="Repetir Contraseña"
          type="password"
          icon={FaLock}
        />
      )}

      {editMode && (
        <Field
          name="status"
          id="status"
          component={SelectInput}
          label="Estado"
          options={[
            { value: "Habilitado", label: "Habilitado" },
            { value: "Deshabilitado", label: "Deshabilitado" },
          ]}
          icon={PiUserCircleCheckBold}
        />
      )}
      {/* <Field
        name="photo"
        id="photo"
        component={FileInput}
        label="Imagen de perfil"
        type="file"
        accept="image/*"
        className="col-span-2"
      /> */}
      <Field name="id" id="id" component={TextInput} type="hidden" />
    </div>
  );
};

export default React.memo(UserFormFields);
