import React from "react";
import classNames from "classnames";

const AccountFields = ({
  id,
  label,
  name,
  value,
  onChange,
  allowEdit,
  isEditing,
  inputType = "text",
  icon: Icon,
}) => {
  return (
    <div className="flex flex-col gap-1 relative">
      <label htmlFor={id} className="text-sm font-semibold text-stone-800">
        {label}
      </label>
      {allowEdit && isEditing ? (
        <div className="relative">
          <input
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            disabled={!allowEdit}
            type={inputType}
            className={classNames(
              "w-full p-2 bg-stone-50 border-none rounded-md",
              Icon ? "pl-10" : "pl-2"
            )}
          />
          {Icon && (
            <span className="absolute top-3 left-2">
              <Icon className="text-neutral-600" />
            </span>
          )}
        </div>
      ) : (
        <p
          className={classNames("p-2 flex gap-2 items-center", {
            "text-stone-800": !isEditing,
          })}
        >
          {Icon && (
            <span>
              <Icon className="text-neutral-600 mr-2" />
            </span>
          )}
          {value}
        </p>
      )}
    </div>
  );
};

export default AccountFields;
