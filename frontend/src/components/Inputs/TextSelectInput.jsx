import React from 'react';
import { ErrorMessage } from 'formik';
import { Label } from 'flowbite-react';
import classNames from 'classnames';
import Select from 'react-select';

const TextSelectInput = ({
  field,
  isOtherOption,
  onOtherSelected,
  className,
  form: { touched, errors, setFieldValue },
  ...props
}) => {
  const handleChange = (selectedOptions) => {
    const values = Array.isArray(selectedOptions)
      ? selectedOptions.map((option) => option.value)
      : selectedOptions?.value;
    setFieldValue(field.name, values);
  };

  return (
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
        className="mt-1 border border-gray-500 rounded-lg"
        closeMenuOnSelect={false}
        classNamePrefix="react-select"
        onChange={handleChange}
        value={props.options.filter((option) => field.value === option.value)}
        options={[
          ...props.options,
          ...(isOtherOption ? [{ label: 'Otro', value: '0' }] : []),
        ]}
      />
      <ErrorMessage
        name={field.name}
        component="div"
        className="text-red-500 text-sm"
      />
    </div>
  );
};

export default TextSelectInput;
