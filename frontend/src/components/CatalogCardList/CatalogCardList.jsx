import { Dropdown } from "flowbite-react";
import React, { useState } from "react";
import Skeleton from "react-loading-skeleton";
import ActionButtons from "../ActionButtons/ActionButtons";
import { BsThreeDotsVertical } from "react-icons/bs";
import TableHeader from "../Table/TableHeader";
import TableActions from "../Table/TableActions";
import { IoMdAdd } from "react-icons/io";
import ModalViewer from "../Modals/ModalViewer";

const CatalogCardList = ({
  data = [],
  title,
  icon: Icon,
  onEdit = () => {},
  onRemove = () => {},
  onCreate = () => {},
}) => {
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const filteredData = data.filter((item) =>
    item?.name?.toLowerCase()?.includes(search?.toLowerCase())
  );

  return (
    <div className="relative h-full flex-col gap-3 shadow-md rounded-md dark:bg-gray-900 p-3 antialiased">
      <div className="absolute inset-x-0 top-0 p-3">
        <div className="flex flex-col gap-3">
          <TableHeader
            icon={Icon}
            title={title}
            actions={[
              {
                label: "Nuevo",
                action: onCreate,
                color: "crossfit",
                icon: IoMdAdd,
                filled: true,
              },
            ]}
          />
          <TableActions handleSearchTerm={(e) => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="mt-32 h-full overflow-y-auto">
        <div className="h-full min-h-32 py-4 pb-32 overflow-y-auto overflow-x-hidden place-content-start grid grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))] gap-4">
          {filteredData &&
            filteredData.length > 0 &&
            filteredData.map((item) => (
              <div
                key={item.id}
                className="w-full h-20 relative bg-white border border-neutral-200 p-4 px-6 rounded-lg hover:shadow-md"
              >
                <div className="flex flex-col justify-start w-full items-start">
                  <p className="text-base md:text-lg font-medium text-gray-900 dark:text-white">
                    {item.name}
                  </p>
                  {item?.description && (
                    <p className="text-xs w-full text-wrap max-w-fit truncate text-gray-500 dark:text-gray-400">
                      {/* cut and append a ... after 40 characters */}
                      {item?.description?.length > 40 ? (
                        <>
                          {`${item.description?.substring(0, 40)}... `}
                          <span
                            onClick={() => {
                              setSelectedItem(item);
                              setShowModal(true);
                            }}
                            className="text-crossfit-light-pink whitespace-nowrap hover:text-crossfit-primary cursor-pointer"
                          >
                            Leer más
                          </span>
                        </>
                      ) : (
                        item.description
                      )}
                    </p>
                  )}
                </div>
                {(onEdit || onRemove) && (
                  <div className="absolute right-1 top-1">
                    <Dropdown
                      className="min-w-[100px] w-36"
                      label={
                        <BsThreeDotsVertical
                          size={32}
                          className="p-2 rounded-full top-2 right-2 hover:bg-neutral-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                        />
                      }
                      dismissOnClick={false}
                      inline
                      arrowIcon={null}
                      placement="right"
                    >
                      {onEdit && (
                        <Dropdown.Item onClick={() => onEdit(item)}>
                          <span>Editar</span>
                        </Dropdown.Item>
                      )}
                      {onRemove && (
                        <Dropdown.Item onClick={() => onRemove(item)}>
                          <span>Eliminar</span>
                        </Dropdown.Item>
                      )}
                    </Dropdown>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
      {showModal && (
        <ModalViewer
          isOpenModal={showModal}
          onCloseModal={() => setShowModal(false)}
          title="Descripción"
        >
          <div className="w-full h-full p-4">
            <div className="flex flex-col gap-3">
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedItem?.name}
              </p>
              <p className="text-base whitespace-pre-line text-gray-500 dark:text-gray-400">
                {selectedItem?.description}
              </p>
            </div>
          </div>
        </ModalViewer>
      )}
    </div>
  );
};

CatalogCardList.Skeleton = () => {
  return (
    <div className="relative h-[74dvh] md:h-[77dvh] flex flex-col gap-3 bg-white shadow-md rounded-md dark:bg-gray-900 p-3 antialiased">
      <div className="absolute inset-x-0 top-0 p-3">
        <div>
          <div className="grid grid-cols-2 gap-4">
            <Skeleton
              height={28}
              className="md:col-span-1 w-full md:w-1/2 mb-2 inline-block"
            />
            <div className="inline-flex justify-end">
              <ActionButtons
                extraActions={[
                  {
                    label: "Nuevo",
                    action: () => {},
                    color: "mycad",
                    icon: IoMdAdd,
                    filled: true,
                  },
                ]}
              />
            </div>
          </div>
          <Skeleton height={28} className="md:col-span-1 w-full mb-2" />
        </div>
      </div>
      <div className="mt-36 md:mt-28 h-full overflow-hidden">
        <div className="h-full min-h-20 overflow-y-auto overflow-x-hidden place-content-start grid grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))] gap-2">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="w-full h-fit p-2 px-4">
              <div className="">
                <Skeleton height={28} className="w-full mb-2" />
                <Skeleton height={28} className="w-full mb-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CatalogCardList;
