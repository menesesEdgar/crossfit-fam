import React from "react";
import { FaEdit, FaRegCalendar, FaTrash } from "react-icons/fa";
import { MdOutlineLocationOn } from "react-icons/md";
import { FiUsers } from "react-icons/fi";
import { FaCog } from "react-icons/fa";
import ActionButtons from "../ActionButtons/ActionButtons";
import { BsThreeDots, BsThreeDotsVertical } from "react-icons/bs";
import { Dropdown } from "flowbite-react";
import classNames from "classnames";
import { AiOutlineEye } from "react-icons/ai";
import { IoLocationOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const CardContest = ({
  contest,
  onView,
  onDelete,
  onEdit,
  allowActions,
  extraActions,
}) => {
  return (
    <article
      className={classNames(
        "flex rounded-lg rounded-l-xl shadow-sm h-full md:max-h-[38dvh] 2xl:max-h-[35dvh] hover:shadow-lg transition ease-in-out duration-200",
        { "bg-crossfit-primary": contest?.status === "Abierta" },
        { "bg-crossfit-info/70": contest?.status === "En curso" },
        { " bg-crossfit-success": contest?.status === "Finalizada" },
        { "bg-red-500": contest?.status === "Cancelada" }
      )}
    >
      <div className="w-[98%] flex border border-neutral-300 bg-neutral-50 flex-col rounded-l-lg justify-between">
        <div className="flex rounded-tl-md flex-col gap-3 px-6 pt-4 pb-2 relative">
          <div className="absolute top-4 right-3">
            <span
              className={`px-3 py-1 font-semibold rounded-full ${
                contest?.status === "Abierta"
                  ? "bg-crossfit-primary text-white"
                  : contest?.status === "En curso"
                  ? "bg-crossfit-info/70 text-white"
                  : contest?.status === "Finalizada"
                  ? "bg-crossfit-success text-white"
                  : contest?.status === "Cancelada"
                  ? "bg-red-500 text-white"
                  : "bg-neutral-100 text-neutral-600"
              }`}
            >
              {contest?.status}
            </span>
          </div>
          <div className="mb-1 pb-1 border-b border-neutral-100">
            <h4 className="text-lg md:text-2xl font-semibold text-neutral-800">
              {contest?.title}
            </h4>
            <h6 className="text-sm md:text-base font-normal text-neutral-500/70">
              {contest?.organizer}
            </h6>
          </div>
          <div className="w-full flex gap-3 items-start">
            <span>
              <FaRegCalendar size={20} className=" text-neutral-400" />
            </span>
            <p className="text-sm md:text-base text-neutral-800">
              {contest?.startDate} - {contest?.endDate}
            </p>
          </div>
          <div className="w-full flex gap-1 items-start">
            <span>
              <IoLocationOutline size={26} className="text-neutral-400 pr-1" />
            </span>
            <p className="text-sm md:text-base text-neutral-800">
              {contest?.location}
            </p>
          </div>
          <div className="w-full flex gap-3 items-start">
            <span>
              <FiUsers size={20} className="text-neutral-400" />
            </span>
            <p className="text-sm md:text-base text-neutral-800">
             <Link to={`/contest/${contest.id}/register`}><a className="hover:underline">{contest?.quantityAthletes} atletas inscritos</a></Link>
            </p>
          </div>
          <div className="w-full flex gap-2 items-start mt-2">
            {contest?.categories?.map((category, index) => {
              if (index > 2) {
                return null;
              } else {
                return (
                  <span
                    className="px-3 py-1 text-nowrap border border-neutral-200 rounded-full text-ellipsis whitespace-nowrap overflow-hidden"
                    key={index}
                  >
                    <span className="text-xs md:text-sm font-medium text-neutral-800 ">
                      {category}
                    </span>
                  </span>
                );
              }
            })}
            {contest?.categories?.length > 3 && (
              <span className="px-3 py-1 text-nowrap border border-neutral-200 h-full flex items-center rounded-full">
                <span className="font-medium text-neutral-800">
                  <BsThreeDots size={20} />
                </span>
              </span>
            )}
            {contest?.categories?.length === 0 && (
              <span className="px-3 py-1 text-nowrap border border-neutral-200 h-full flex items-center rounded-full">
                <span className="text-xs md:text-sm font-medium text-neutral-800">
                  Sin categorías asignadas
                </span>
              </span>
            )}
          </div>
        </div>
        <div className="w-full rounded-b-lg bg-white flex gap-2 p-4">
          {allowActions && (
            <>
              <div className="bg-white">
                <ActionButtons
                  extraActions={[
                    {
                      label: "Editar",
                      action: () => onView(contest?.id),
                      color: "neutral",
                      icon: FaEdit,
                    },
                  ]}
                />
              </div>
              <Dropdown
                renderTrigger={() => (
                  <button className="w-fit bg-white hover:bg-neutral-200 md:w-fit h-9 xl:h-10 text-sm xl:text-base cursor-pointer transition ease-in-out duration-200 p-4 flex items-center justify-center rounded-md border text-stone-800">
                    <BsThreeDotsVertical className="text-lg text-neutral-600" />
                  </button>
                )}
                dismissOnClick={false}
                inline
                arrowIcon={null}
                placement="right"
              >
                <Dropdown.Item
                  className="min-w-36"
                  onClick={() => onEdit(contest)}
                  icon={FaCog}
                >
                  <span>Configurar</span>
                </Dropdown.Item>
                <Dropdown.Item
                  className="min-w-36"
                  onClick={() => onDelete(contest?.id)}
                  icon={FaTrash}
                >
                  <span>Eliminar</span>
                </Dropdown.Item>
              </Dropdown>
            </>
          )}
          {extraActions && <ActionButtons extraActions={extraActions} />}
        </div>
      </div>
    </article>
  );
};

export default CardContest;
