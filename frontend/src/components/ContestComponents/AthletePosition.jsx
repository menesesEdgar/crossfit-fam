import { Tooltip } from "flowbite-react";
import React from "react";
import { FaInfoCircle, FaMedal } from "react-icons/fa";

const AthletePosition = ({ position }) => {
  const getPositionText = (pos) => {
    if (pos === 1) return "1er";
    if (pos === 2) return "2do";
    if (pos === 3) return "3er";

    const suffix = ["to", "to", "to", "to", "to", "to", "to", "to", "vo", "no"];
    const lastDigit = pos % 10;
    return `${pos}${suffix[lastDigit] || "to"}`;
  };

  const getPositionIcon = (pos) => {
    if (pos === 1)
      return <FaMedal className="text-yellow-500" title="1er lugar" />;
    if (pos === 2)
      return <FaMedal className="text-gray-400" title="2do lugar" />;
    if (pos === 3)
      return <FaMedal className="text-orange-500" title="3er lugar" />;
    return null;
  };

  if (position === 0 || position === null || position === undefined) {
    return (
      <Tooltip content="A la espera del resultado del ejercicio" position="top">
        <div className="flex items-center gap-2">
          <span className="text-base">
            <FaInfoCircle
              className="text-blue-400"
              title="A la espera del resultado del ejercicio"
            />
          </span>
        </div>
      </Tooltip>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {getPositionIcon(position) || (
        <span className="text-sm font-bold text-gray-700">
          {getPositionText(position)}
        </span>
      )}
    </div>
  );
};

export default AthletePosition;
