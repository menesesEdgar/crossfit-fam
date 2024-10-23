import React from 'react';
import classNames from 'classnames';

const AccountFields = ({
  id,
  label,
  name,
  value,
  onChange,
  allowEdit,
  isEditing,
  inputType = 'text',
}) => {
  return (
    <div className="flex flex-col gap-1 relative">
      <label htmlFor={id} className="text-sm font-semibold text-stone-800">
        {label}
      </label>
      {allowEdit && isEditing ? (
        <input
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          disabled={!allowEdit}
          type={inputType}
          className="w-full p-2 bg-stone-100 border-t-0 border-l-0 border-r-0 border-b border-2 border-stone-700"
        />
      ) : (
        <p
          className={classNames('p-2 border-b border-b-white', {
            'text-stone-800': !isEditing,
          })}
        >
          {value}
        </p>
      )}
    </div>
  );
};

export default AccountFields;
