import React from "react";
import { Field } from "formik";
import TextInput from "../../Inputs/TextInput";
import TextArea from "../../Inputs/TextArea";
import { FaDumbbell } from "react-icons/fa";

const WodFormFields = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <Field
        name="name"
        id="name"
        component={TextInput}
        label="* WOD"
        type="text"
        icon={FaDumbbell}
        className="col-span-2"
      />
      <Field
        name="description"
        id="description"
        component={TextArea}
        label="Descripción"
        className="col-span-2"
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

export default WodFormFields;
