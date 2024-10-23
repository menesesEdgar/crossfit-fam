import React from 'react';
import { ErrorMessage } from 'formik';
import { Label, Select } from 'flowbite-react';
import classNames from 'classnames';

const SelectInput = ({
  field,
  isOtherOption,
  onOtherSelected,
  className,
  form: { touched, errors, setFieldValue },
  ...props
}) => (
  <div className={classNames('w-full', className)}>
    <Label
      htmlFor={props.id || props.name}
      className="block text-sm font-medium"
      color={touched[field.name] && errors[field.name] ? 'failure' : ''}
      value={props.label}
    />
    <Select
      {...field}
      {...props}
      color={touched[field.name] && errors[field.name] ? 'failure' : ''}
      className="mt-1"
      onChange={(e) => {
        const value = e.target.value;
        setFieldValue(field.name, value);
        if (value === '0' && onOtherSelected && isOtherOption) {
          onOtherSelected();
        }
      }}
    >
      <option disabled value="">
        Seleccione una opción
      </option>
      {props.options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
      {isOtherOption && <option value="0">Otro</option>}
    </Select>
    <ErrorMessage
      name={field.name}
      component="div"
      className="text-red-500 text-sm"
    />
  </div>
);

export default SelectInput;
