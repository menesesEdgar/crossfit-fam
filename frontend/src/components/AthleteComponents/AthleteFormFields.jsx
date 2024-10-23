import React from 'react';
import { Field } from 'formik';
import TextInput from '../Inputs/TextInput';
import { BiCategory } from 'react-icons/bi';
import { PiTrademarkRegisteredBold } from 'react-icons/pi';
import { MdOutlineDirectionsCar } from 'react-icons/md';
import { FaCalendar } from 'react-icons/fa';
import SelectInput from '../Inputs/SelectInput';
const genderOptions = [{
    id: "1",
    name: "Masculino"
},
{
    id: "2",
    name: "Femenino"
}
]
const AthleteFormFields = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <Field
        name="firstName"
        id="firstName"
        component={TextInput}
        label="Nombre"
        type="text"
        icon={MdOutlineDirectionsCar}
      />
      <Field
        name="lastName"
        id="lastName"
        component={TextInput}
        label="Apellidos"
        type="text"
        icon={FaCalendar}
      />
      <Field
        name="age"
        id="age"
        component={TextInput}
        label="Edad"
        type="number"
        icon={PiTrademarkRegisteredBold}
      />
      <Field
        name="gender"
        id="gender"
        component={SelectInput}
        label="Género"
        type="number"
        options={genderOptions.map((gender) => ({
            label: gender.name,
            value: gender.id,
          }))}
        icon={PiTrademarkRegisteredBold}
      />
      <Field
        name="email"
        id="email"
        component={TextInput}
        label="Correo electrónico"
        type="text"
        icon={PiTrademarkRegisteredBold}
      />
      <Field
        name="password"
        id="password"
        component={TextInput}
        label="Contraseña"
        icon={BiCategory}
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
