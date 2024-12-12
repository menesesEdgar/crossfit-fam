import { FaChevronLeft } from "react-icons/fa";
import ActionButtons from "../ActionButtons/ActionButtons";

const TableHeader = ({ title, icon: Icon, actions, backAction }) => {
  return (
    <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between text-start gap-4">
      <div className="flex items-center gap-2 text-crossfit-primary w-full">
        {backAction && (
          <button
            onClick={() => window.history.back()}
            type="button"
            className="w-8 h-8 p-2 flex items-center justify-center rounded-md hover:bg-neutral-200 transition ease-in-out duration-200"
          >
            <FaChevronLeft size={20} className="text-crossfit-primary" />
          </button>
        )}
        {Icon && <Icon size={24} className="inline-block" />}
        <h1 className="text-xl xl:text-2xl font-bold">{title}</h1>
      </div>
      {actions && (
        <div className="w-full flex gap-2 justify-start md:justify-end">
          <ActionButtons extraActions={actions} />
        </div>
      )}
    </div>
  );
};

export default TableHeader;
