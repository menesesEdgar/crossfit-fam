import React from "react";
import { Link } from "react-router-dom";
import { HiHome } from "react-icons/hi";
import classNames from "classnames";
import { IoChevronForward } from "react-icons/io5";

const Breadcrumbs = ({ breadcrumbs = [] }) => {
  return (
    <div className="group flex items-center mb-3">
      <Link
        to="/"
        className="text-crossfit-primary h-5 hover:text-indigo-900 cursor-pointer p-0 m-0 group flex items-center"
      >
        <HiHome size={18} className="p-0" />
        <span className="text-sm font-semibold">&nbsp;</span>
      </Link>
      {breadcrumbs &&
        breadcrumbs?.map((route, index) => (
          <span className="group flex items-center" key={index}>
            <span>
              <IoChevronForward
                size={18}
                className="text-crossfit-primary mx-1 md:mx-2"
              />{" "}
            </span>
            <Link
              to={route?.href}
              className={classNames(
                "flex items-center h-5 text-sm font-medium",
                route?.href
                  ? "text-crossfit-primary hover:text-indigo-900 dark:text-crossfit-primary dark:hover:text-white"
                  : "cursor-default text-crossfit-primary",
                index === breadcrumbs?.length - 1 &&
                  "pointer-events-none opacity-60"
              )}
            >
              {route.icon && <route.icon size={18} className="mr-2 -mt-0.5" />}
              {route.label}
            </Link>
          </span>
        ))}
    </div>
  );
};

export default Breadcrumbs;
