import { Link } from "react-router-dom";
import { Button } from "flowbite-react";
import { getButtonClassNames } from "../../utils/getButtonClassNames";

const LinkButton = ({
  route,
  color,
  filled,
  icon: Icon,
  label,
  outline = false,
  disabled = false,
  className,
  iconRight,
}) => {
  return (
    <Link
      className={getButtonClassNames(color, filled, disabled, className)}
      to={!disabled ? route : null}
    >
      {iconRight ? (
        <>
          <span className={`${label?.length > 0 && "mr-2"}`}>{label}</span>
          {Icon && (
            <i>
              <Icon size={18} />
            </i>
          )}
        </>
      ) : (
        <>
          {Icon && (
            <i>
              <Icon size={18} />
            </i>
          )}
          <span className={`${label?.length > 0 && "ml-2"}`}>{label}</span>
        </>
      )}
    </Link>
  );
};

export default LinkButton;
