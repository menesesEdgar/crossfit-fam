import { Link } from 'react-router-dom';
import { Button } from 'flowbite-react';
import { getButtonClassNames } from '../../utils/getButtonClassNames';

const LinkButton = ({
  route,
  color,
  filled,
  icon: Icon,
  label,
  outline = false,
  disabled = false,
  className,
}) => {
  return (
    <Link
      className={getButtonClassNames(color, filled, disabled, className)}
      to={!disabled ? route : null}
    >
      {Icon && (
        <i>
          <Icon size={18} />
        </i>
      )}
      <span className={`${label?.length > 0 && 'ml-2'}`}>{label}</span>
    </Link>
  );
};

export default LinkButton;
