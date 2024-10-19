import React from 'react';
import { Link } from 'react-router-dom';
import { HiHome } from 'react-icons/hi';
import classNames from 'classnames';
import { IoChevronForward } from 'react-icons/io5';

const Breadcrumbs = ({ breadcrumbs = [] }) => {
  return (
    <div className="group flex items-start pb-4">
      <Link
        to="/"
        className="text-neutral-700 hover:text-indigo-900 cursor-pointer p-0 m-0 group flex items-center"
      >
        <HiHome className="h-4 w-4 p-0" />
        <span className="text-sm font-semibold">&nbsp;</span>
      </Link>
      {breadcrumbs &&
        breadcrumbs?.map((route, index) => (
          <span className="group flex items-center" key={index}>
            <span>
              <IoChevronForward className="mx-1 h-4 w-4 text-gray-400 md:mx-2" />{' '}
            </span>
            <Link
              to={route?.href}
              className={classNames(
                'flex items-center text-sm font-medium',
                route?.href
                  ? 'text-gray-700 hover:text-indigo-900 dark:text-gray-400 dark:hover:text-white'
                  : 'cursor-default text-gray-500',
                index === breadcrumbs?.length - 1 &&
                  'pointer-events-none opacity-60',
              )}
            >
              {route.icon && <route.icon className="mr-2 h-3.5 w-3.5" />}
              {route.label}
            </Link>
          </span>
        ))}
    </div>
  );
};

export default Breadcrumbs;
