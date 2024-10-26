import React from "react";
import { Field } from "formik";
import TextInput from "../../Inputs/TextInput";
import { TbListNumbers } from "react-icons/tb";
import { GiMuscleUp } from "react-icons/gi";
import TextArea from "../../Inputs/TextArea";

const CategoryFormFields = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <Field
        name="name"
        id="name"
        component={TextInput}
        label="* Categoría"
        type="text"
        icon={GiMuscleUp}
        className="col-span-2"
      />
      <Field
        name="description"
        id="description"
        component={TextArea}
        label="Descripción de la categoría"
        type="text"
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

export default CategoryFormFields;
