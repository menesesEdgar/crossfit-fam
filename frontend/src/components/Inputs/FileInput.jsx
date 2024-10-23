import React from 'react';
import { ErrorMessage } from 'formik';
import { FileInput as File, Label } from 'flowbite-react';
import classNames from 'classnames';
import FileIcon from '../FileIcon/FileIcon';

const FileInput = ({
  className,
  field,
  form: { setFieldValue, touched, errors },
  ...props
}) => {
  const handleChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const currentFiles = field.value || [];
    const combinedFiles = [...currentFiles, ...newFiles];
    setFieldValue(field.name, combinedFiles);
  };

  const removeFile = (index) => {
    const updatedFiles = field.value.filter((_, i) => i !== index);
    setFieldValue(field.name, updatedFiles);
  };

  return (
    <div className={classNames('w-full', className)}>
      <Label
        htmlFor={props.id || props.name}
        className={'block text-sm font-medium'}
        color={touched[field.name] && errors[field.name] ? 'failure' : ''}
        value={props.label}
      />
      <File
        id={props.id || props.name}
        multiple={props.multiple}
        helperText={props.helperText || ''}
        accept={props.accept || ''}
        color={touched[field.name] && errors[field.name] ? 'failure' : ''}
        className="mt-1"
        onChange={handleChange}
      />
      <div className="mt-2 max-h-48 md:max-h-full grid gap-1 overflow-y-auto bg-neutral-50 p-2">
        {field.value &&
          field.value.length > 0 &&
          field.value?.map((file, index) => (
            <FileIcon
              key={index}
              file={file}
              onRemove={() => removeFile(index)}
            />
          ))}
      </div>
      <ErrorMessage
        name={field.name}
        component="div"
        className="text-red-500 text-sm"
      />
    </div>
  );
};

export default FileInput;
