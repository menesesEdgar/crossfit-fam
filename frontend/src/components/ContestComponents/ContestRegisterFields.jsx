import React from "react";
import { Field } from "formik";
import TextInput from "../Inputs/TextInput";
import { BiCategory } from "react-icons/bi";
import SelectInput from "../Inputs/SelectInput";

const ContestRegisterFields = ({ isUpdate, categories }) => {
  return (
    <div className="grid grid-cols-1 gap-3">
        <Field
          name="categoryId"
          id="categoryId"
          component={SelectInput}
          label="Categoría"
          icon={BiCategory}
          options={categories.map((category) => ({
            label: category?.category?.name,
            value: category.id,
          }))}
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

export default ContestRegisterFields;
