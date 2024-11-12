import React, { useState } from "react";
import { ErrorMessage } from "formik";
import { TextInput as Input, Label } from "flowbite-react";
import classNames from "classnames";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { formatPhoneNumber } from "../../utils/formatPhoneNumber";

const TextInput = ({
  className,
  field,
  form: { touched, errors, setFieldValue },
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputType =
    props.type === "password" && showPassword ? "text" : props.type;

  const handleChange = (e) => {
    if (props.type === "tel") {
      const formattedValue = formatPhoneNumber(e.target.value);
      setFieldValue(field.name, formattedValue);
    } else {
      field.onChange(e);
    }
  };

  return (
    <div className={classNames("relative w-full", className)}>
      <Label
        htmlFor={props.id || props.name}
        className={"block text-sm font-medium"}
        color={touched[field.name] && errors[field.name] ? "failure" : ""}
        value={props.label}
      />
      <div className="relative">
        <Input
          {...field}
          {...props}
          type={inputType}
          color={touched[field.name] && errors[field.name] ? "failure" : ""}
          className="mt-1 text-neutral-800"
          onChange={handleChange}
        />
        {props.type === "password" && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 flex items-center px-2 text-neutral-500"
          >
            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </button>
        )}
      </div>
      <ErrorMessage
        name={field.name}
        component="div"
        className="text-red-500 text-sm"
      />
    </div>
  );
};

export default TextInput;
