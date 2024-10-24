import React from "react";
import { Field } from "formik";
import TextInput from "../Inputs/TextInput";
import { MdEmail } from "react-icons/md";
import {
  FaCalendarAlt,
  FaPhoneSquareAlt,
  FaUser,
  FaUserTag,
  FaVenusMars,
} from "react-icons/fa";
import SelectInput from "../Inputs/SelectInput";
const genderOptions = [
  {
    id: "1",
    name: "Masculino",
  },
  {
    id: "2",
    name: "Femenino",
  },
  {
    id: "3",
    name: "Otro",
  },
];
const AthleteFormFields = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <Field
        name="firstName"
        id="firstName"
        component={TextInput}
        label="* Nombre"
        type="text"
        icon={FaUser}
      />
      <Field
        name="lastName"
        id="lastName"
        component={TextInput}
        label="* Apellidos"
        type="text"
        icon={FaUserTag}
      />
      <Field
        name="birthDate"
        id="birthDate"
        component={TextInput}
        label="* Fecha de nacimiento"
        type="date"
        icon={FaCalendarAlt}
      />
      <Field
        name="gender"
        id="gender"
        component={SelectInput}
        label="* Género"
        type="number"
        options={genderOptions.map((gender) => ({
          label: gender.name,
          value: gender.id,
        }))}
        icon={FaVenusMars}
      />
      <Field
        name="email"
        id="email"
        component={TextInput}
        label="* Correo electrónico"
        type="text"
        icon={MdEmail}
        placeholder="example@mail.com"
      />
      <Field
        name="phone"
        id="phone"
        component={TextInput}
        label="Teléfono"
        type="tel"
        icon={FaPhoneSquareAlt}
        placeholder="123-456-7890"
      />
      <Field
        className="hidden"
        name="id"
        label="id"
        component={TextInput}
        type="hidden"
        disabled={true}
      />
    </div>
  );
};

export default AthleteFormFields;