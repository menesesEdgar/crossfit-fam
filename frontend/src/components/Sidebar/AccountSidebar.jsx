import React from "react";
import classNames from "classnames";

import { MdAccountCircle } from "react-icons/md";
// import ImageViewer from '../ImageViewer/ImageViewer';

const AccountSidebar = ({ name, role }) => {
  return (
    <div className="p-4 h-fit space-y-5">
      <div
        className={classNames(
          "w-full whitespace-nowrap overflow-hidden flex justify-start gap-4 items-center"
        )}
      >
        <div className="flex justify-center items-center h-10 w-10 min-w-10 min-h-10 overflow-hidden rounded-full">
          <MdAccountCircle size={32} className={"text-white"} />
        </div>
        <div className={"truncate whitespace-nowrap text-nowrap"}>
          <h2
            className={classNames(
              "text-sm font-bold text-pink-500 w-full truncate"
            )}
          >
            {name}
          </h2>
          <p className={classNames("text-white w-full truncate text-xs")}>
            {role}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountSidebar;