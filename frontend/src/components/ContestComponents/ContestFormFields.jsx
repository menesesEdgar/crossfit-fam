import React from "react";
import { Field } from "formik";
import TextInput from "../Inputs/TextInput";
import DateInput from "../Inputs/DateInput";
import { BiCategory } from "react-icons/bi";
import { FaLocationDot } from "react-icons/fa6";
import { FaCalendar, FaFlagCheckered, FaUser } from "react-icons/fa";
import SelectInput from "../Inputs/SelectInput";
const statusOptions = [
  {
    id: "Borrador",
    name: "Borrador",
  },
  {
    id: "Abierta",
    name: "Abierta",
  },
  {
    id: "En curso",
    name: "En curso",
  },
  {
    id: "Finalizada",
    name: "Finalizada",
  },
  {
    id: "Cancelada",
    name: "Cancelada",
  },
];

const ContestFormFields = ({ isUpdate }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <Field
        name="name"
        id="Name"
        component={TextInput}
        label="Nombre de la competencia"
        type="text"
        icon={FaFlagCheckered}
      />
      <Field
        name="organizer"
        id="organizer"
        component={TextInput}
        label="Organizador"
        type="text"
        icon={FaUser}
      />
      <Field
        name="startDate"
        id="startDate"
        component={DateInput}
        label="Fecha de inicio"
        type="date"
        icon={FaCalendar}
      />
      <Field
        name="endDate"
        id="endDate"
        component={DateInput}
        label="Fecha fin"
        type="date"
        icon={FaCalendar}
      />
      {isUpdate ? (
        <Field
          name="status"
          id="status"
          component={SelectInput}
          label="Estatus"
          icon={BiCategory}
          options={statusOptions.map((status) => ({
            label: status.name,
            value: status.id,
          }))}
        />
      ) : (
        <Field
          className="hidden"
          name="status"
          label="status"
          component={TextInput}
          type="hidden"
          value={"Borrador"}
          disabled={true}
        />
      )}
      <Field
        name="location"
        id="location"
        component={TextInput}
        label="Ubicación"
        type="text"
        icon={FaLocationDot}
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

export default ContestFormFields;
