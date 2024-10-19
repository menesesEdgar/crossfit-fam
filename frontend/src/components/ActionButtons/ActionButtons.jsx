import React, { forwardRef } from 'react';
import { FaEdit, FaEye, FaPlus, FaTrash } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';
import LinkButton from './LinkButton';
import { getButtonClassNames } from '../../utils/getButtonClassNames';

const ActionButtons = forwardRef(
  (
    {
      onShow,
      onEdit,
      onRemove,
      onCreate,
      onCancel,
      labelShow,
      labelEdit,
      labelRemove,
      labelCreate,
      labelCancel,
      extraActions = [],
    },
    ref,
  ) => {
    const actions = [
      ...extraActions.map((action) => ({
        ...action,
      })),
      {
        label: labelShow || 'Ver',
        action: onShow,
        color: 'cyan',
        icon: FaEye,
        disabled: false,
      },
      {
        label: labelEdit || 'Editar',
        action: onEdit,
        color: 'yellow',
        icon: FaEdit,
        disabled: false,
      },
      {
        label: labelRemove || 'Eliminar',
        action: onRemove,
        color: 'red',
        icon: FaTrash,
        disabled: false,
      },
      {
        label: labelCreate || 'Nuevo',
        action: onCreate,
        color: 'indigo',
        icon: FaPlus,
        disabled: false,
      },
      {
        label: labelCancel || 'Cancelar',
        action: onCancel,
        color: 'red',
        icon: MdCancel,
        disabled: false,
      },
    ];
    const filteredActions = actions.filter(
      (action) => action.action || action.href,
    );

    if (filteredActions.length === 0) {
      return null;
    }

    return filteredActions.map((action, index) =>
      action?.href ? (
        <LinkButton
          key={index}
          route={action.href}
          color={action.color}
          icon={action.icon}
          label={action.label}
          outline={action?.outline}
          filled={action?.filled}
          disabled={action?.disabled || false}
          className={action?.className}
        />
      ) : (
        <button
          key={index}
          ref={ref}
          onClick={action.action}
          className={getButtonClassNames(
            action?.color,
            action?.filled,
            action?.disabled,
            action?.className,
          )}
          outline={action?.outline}
          type={action?.type || 'button'}
          disabled={action?.disabled || false}
        >
          <i>{action.icon && <action.icon size={18} />}</i>
          <span className={`${action?.label?.length > 0 && 'ml-2'}`}>
            {action.label}
          </span>
        </button>
      ),
    );
  },
);

export default ActionButtons;
