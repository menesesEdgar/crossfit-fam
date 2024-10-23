import React from 'react';
import { ErrorMessage } from 'formik';
import { Textarea as Area, Label } from 'flowbite-react';
import classNames from 'classnames';

const TextArea = ({
  field,
  className,
  form: { touched, errors },
  ...props
}) => (
  <div className={classNames('w-full', className)}>
    <Label
      htmlFor={props.id || props.name}
      className={'block text-sm font-medium'}
      color={touched[field.name] && errors[field.name] ? 'failure' : ''}
      value={props.label}
    />
    <Area
      {...field}
      {...props}
      color={touched[field.name] && errors[field.name] ? 'failure' : ''}
      className="mt-1 min-h-44 md:min-h-28"
    />
    <ErrorMessage
      name={field.name}
      component="div"
      className="text-red-500 text-sm"
    />
  </div>
);

export default TextArea;
