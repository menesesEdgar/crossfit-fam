import React, { useCallback, useEffect, useRef, useState } from "react";
import { FaSort, FaEdit, FaSave, FaUndo } from "react-icons/fa";
import AccountFields from "../AccountFields/AccountFields";
import { TbClockBolt, TbNumber123 } from "react-icons/tb";
import ActionButtons from "../ActionButtons/ActionButtons";
import { BiTargetLock } from "react-icons/bi";
import { useParams } from "react-router-dom";
import { TextInput } from "flowbite-react";
import { LuSearch } from "react-icons/lu";
import { Accordion } from "flowbite-react";

const Leaderboard = ({
  competition,
  wods,
  athletes,
  category,
  addScoreToAthlete,
}) => {
  // Estado para almacenar las filas en modo de edición
  const [editingAthleteId, setEditingAthleteId] = useState(null);
  const [editableAthletes, setEditableAthletes] = useState(athletes);
  const lastChange = useRef();
  useEffect(() => {
    if (athletes) {
      setEditableAthletes(athletes);
    }
  }, [athletes]);
  const { id } = useParams();
  // Función para activar el modo de edición en una fila específica
  const handleEditClick = (athleteId) => {
    setEditingAthleteId(athleteId);
  };
  const [searchFilters, setSearchFilters] = useState({
    searchTerm: "",
    sortBy: "firstName",
    order: "asc",
  });
  // Función para cancelar la edición en una fila específica
  const handleCancelClick = () => {
    setEditingAthleteId(null);
    setEditableAthletes(athletes); // Restaurar los valores originales
  };

  // Función para guardar los cambios en una fila específica
  const handleSaveClick = async () => {
    // Aquí puedes enviar `editableAthletes` a tu API o backend
    const athleteData = editableAthletes?.find(
      (athlete) => athlete.id === parseInt(editingAthleteId)
    );
    await addScoreToAthlete({
      contestId: id,
      athleteId: editingAthleteId,
      ...athleteData,
    });
    setEditingAthleteId(null);
  };

  // Función para actualizar el valor en el estado de `editableAthletes`
  const handleChange = (athleteId, wodId, field, value) => {
    const updatedAthletes = editableAthletes.map((athlete) => {
      if (athlete.id === athleteId) {
        return {
          ...athlete,
          scores: {
            ...athlete.scores,
            [wodId]: {
              ...athlete.scores[wodId],
              [field]: value,
            },
          },
        };
      }
      return athlete;
    });
    setEditableAthletes(updatedAthletes);
  };
  const handleSearchTerm = useCallback(
    (e) => {
      e.preventDefault();
      if (lastChange.current) {
        clearTimeout(lastChange.current);
      }
      lastChange.current = setTimeout(() => {
        lastChange.current = null;
        setSearchFilters((prevState) => {
          return {
            ...prevState,
            searchTerm: e.target.value,
          };
        });
      }, 600);
    },
    [searchFilters?.searchTerm]
  );

  const filteredAthletes = editableAthletes?.filter((score) =>
    JSON.stringify(score)
      .toLowerCase()
      .includes(searchFilters.searchTerm.toLowerCase())
  );

  console.log(athletes);
  return (
    <div className="flex-1 md:overflow-hidden overflow-y-auto md:p-4 w-full md:text-nowrap mt-2 md:mt-0">
      <h2 className="pl-4 md:pl-0 text-crossfit-secondary text-xl font-semibold">
        {competition.name} - {category?.name}
      </h2>
      <div className="w-full md:w-[40vw] px-4 md:px-0 pt-2 md:py-4">
        <form className="flex items-center">
          <div className="relative w-full">
            <TextInput
              icon={LuSearch}
              type="search"
              placeholder="Buscar"
              onChange={handleSearchTerm}
              className="h-10 w-full"
              style={{
                backgroundColor: "#fff",
                borderRadius: "5px",
                border: "1px solid #e5e5e5",
              }}
            />
          </div>
        </form>
      </div>
      <table className="min-w-full w-full bg-white mt-4 md:mt-0">
        <thead className="bg-crossfit-light-purple text-white">
          <tr>
            <th className="py-2 px-4 text-left w-20">#</th>
            <th className="py-2 px-4 text-left w-full md:w-40">Atleta</th>
            {wods.map((wod, index) => (
              <th
                key={index}
                className="hidden md:table-cell py-2 px-4 text-left w-[70vw] md:w-40 "
              >
                {wod.name} <FaSort className="inline ml-1" />
              </th>
            ))}
            <th className="hidden md:table-cell  py-2 px-4 text-left w-60">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="w-full max-h-[70vh] overflow-y-auto">
          {filteredAthletes.map((athlete, idx) => (
            <tr
              key={athlete.id}
              className="md:border-b w-full md:hover:bg-purple-100 odd:bg-purple-50/80 border-b border-b-neutral-100"
            >
              <td className="py-2 px-4 flex flex-col justify-center text-center w-20">
                {parseInt(athlete.position) + 1}{" "}
                <span className="text-xs">
                  ({athlete?.totalScore || 0} pts)
                </span>
              </td>
              <td className="md:py-2 md:px-4">
                <div className="hidden md:table-cell">
                  <p>{athlete?.name}</p>
                  <p className="text-xs text-gray-500">{athlete.category}</p>
                </div>
                <div className="md:hidden">
                  <Accordion className="border-none" collapseAll>
                    <Accordion.Panel>
                      <Accordion.Title
                        theme={{
                          open: { on: "bg-transparent active:bg-transparent " },
                          flush: {
                            off: "bg-transparent active:bg-transparent",
                          },
                        }}
                      >
                        <p className="text-crossfit-secondary">
                          {athlete?.name}
                        </p>
                        <span className="text-xs text-gray-500">
                          {athlete?.category}
                        </span>
                      </Accordion.Title>
                      <Accordion.Content>
                        {wods.map((wod) => (
                          <div
                            key={wod.id}
                            className="w-full flex flex-col mb-4"
                          >
                            <p>{wod.name}</p>
                            <div className="grid grid-cols-2 gap-4 w-full border-b-2 border-b-neutral-200">
                              <div className="w-full min-h-11">
                                <AccountFields
                                  name="quantity"
                                  id={`quantity-${athlete.id}-${wod.id}`}
                                  inputType="text"
                                  value={athlete.scores[wod.id]?.quantity || ""}
                                  onChange={(e) =>
                                    handleChange(
                                      athlete.id,
                                      wod.id,
                                      "quantity",
                                      e.target.value
                                    )
                                  }
                                  allowEdit={true}
                                  isEditing={editingAthleteId === athlete.id}
                                  icon={TbNumber123}
                                />
                              </div>
                              <div className="w-full min-h-11">
                                <AccountFields
                                  name="time"
                                  id={`time-${athlete.id}-${wod.id}`}
                                  inputType="text"
                                  value={athlete.scores[wod.id]?.time || ""}
                                  onChange={(e) =>
                                    handleChange(
                                      athlete.id,
                                      wod.id,
                                      "time",
                                      e.target.value
                                    )
                                  }
                                  allowEdit={true}
                                  isEditing={editingAthleteId === athlete.id}
                                  icon={TbClockBolt}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                        {editingAthleteId === athlete.id ? (
                          <div className="flex gap-2 items-center pt-4">
                            <ActionButtons
                              extraActions={[
                                {
                                  label: "Guardar",
                                  action: handleSaveClick,
                                  icon: FaSave,
                                  color: "purple",
                                  filled: true,
                                },
                                {
                                  label: "Cancelar",
                                  action: handleCancelClick,
                                  icon: FaUndo,
                                  color: "red",
                                  filled: true,
                                },
                              ]}
                            />
                          </div>
                        ) : (
                          <div className="flex gap-2 items-center pt-4">
                            <ActionButtons
                              extraActions={[
                                {
                                  label: "Editar",
                                  action: () => handleEditClick(athlete.id),
                                  icon: FaEdit,
                                  color: "blue",
                                  filled: true,
                                },
                              ]}
                            />
                          </div>
                        )}
                      </Accordion.Content>
                    </Accordion.Panel>
                  </Accordion>
                </div>
              </td>
              {wods.map((wod) => (
                <td
                  key={wod.id}
                  className="hidden md:table-cell py-2 px-4 w-full md:w-60"
                >
                  <div className="w-full grid grid-cols-2 gap-2">
                    <AccountFields
                      name="quantity"
                      id={`quantity-${athlete.id}-${wod.id}`}
                      inputType="text"
                      value={athlete.scores[wod.id]?.quantity || ""}
                      onChange={(e) =>
                        handleChange(
                          athlete.id,
                          wod.id,
                          "quantity",
                          e.target.value
                        )
                      }
                      allowEdit={true}
                      isEditing={editingAthleteId === athlete.id}
                      icon={BiTargetLock}
                    />
                    <AccountFields
                      name="time"
                      id={`time-${athlete.id}-${wod.id}`}
                      inputType="text"
                      value={athlete.scores[wod.id]?.time || ""}
                      onChange={(e) =>
                        handleChange(athlete.id, wod.id, "time", e.target.value)
                      }
                      allowEdit={true}
                      isEditing={editingAthleteId === athlete.id}
                      icon={TbClockBolt}
                    />
                  </div>
                </td>
              ))}
              <td className="hidden md:table-cell p-2 md:w-64 py-3">
                {editingAthleteId === athlete.id ? (
                  <div className="flex gap-2 items-center">
                    <ActionButtons
                      extraActions={[
                        {
                          label: "Guardar",
                          action: handleSaveClick,
                          icon: FaSave,
                          color: "purple",
                        },
                        {
                          label: "Cancelar",
                          action: handleCancelClick,
                          icon: FaUndo,
                          color: "red",
                        },
                      ]}
                    />
                  </div>
                ) : (
                  <div className="flex gap-2 items-center">
                    <ActionButtons
                      extraActions={[
                        {
                          label: "Editar",
                          action: () => handleEditClick(athlete.id),
                          icon: FaEdit,
                          color: "blue",
                        },
                      ]}
                    />
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default React.memo(Leaderboard);
