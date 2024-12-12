import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FaSort,
  FaEdit,
  FaSave,
  FaUndo,
  FaMinus,
  FaInfoCircle,
} from "react-icons/fa";
import AccountFields from "../AccountFields/AccountFields";
import { TbClockBolt, TbNumber123 } from "react-icons/tb";
import ActionButtons from "../ActionButtons/ActionButtons";
import { BiTargetLock } from "react-icons/bi";
import { useParams } from "react-router-dom";
import { TextInput, Tooltip } from "flowbite-react";
import { LuMinus, LuSearch } from "react-icons/lu";
import { Accordion } from "flowbite-react";
import classNames from "classnames";
import AthletePosition from "./AthletePosition";
import { useAuthContext } from "../../context/AuthContext";

const Leaderboard = ({
  competition,
  wods,
  athletes,
  category,
  addScoreToAthlete,
  setUpdateScores
}) => {
  // Estado para almacenar las filas en modo de edición
  const [editingAthleteId, setEditingAthleteId] = useState(null);
  const [editableAthletes, setEditableAthletes] = useState(athletes);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const lastChange = useRef();
  const { user } = useAuthContext();
  // For security, athlete by default otherwise admin or root
  const role = useMemo(() => user?.role?.name || "Athlete", [user]);
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
    setUpdateScores((prevState) => !prevState)
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

  const handleSort = (header) => {
    let direction = "asc";
    if (sortConfig.key === header && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key: header, direction });
    sortAthletes(header, direction);
  };

  const handleSearchTerm = 
    (e) => {
      e.preventDefault();
      if (lastChange.current) {
        clearTimeout(lastChange.current);
      }
      lastChange.current = setTimeout(() => {
        lastChange.current = null;
        const filteredAthletes = athletes?.filter(
          (athlete) =>
            JSON.stringify(athlete).toLowerCase().includes(e.target.value.toLowerCase())
        );
        setEditableAthletes(filteredAthletes)
      }, 600);
    }

  const sortAthletes = (key, direction) => {
    const sorted = [...athletes].sort((a, b) => {
      let aValue = 0;
      let bValue = 0;

      if (key === "name") {
        aValue = a.name;
        bValue = b.name;
      } else if (key === "totalScore") {
        aValue = a.totalScore;
        bValue = b.totalScore;
      } else if (key.startsWith("scores")) {
        // Para las puntuaciones de los WODs
        const wodId = key.split(".")[1]; // Obtener el ID del WOD desde la clave
        aValue = a.scores[wodId]?.position || 0;
        bValue = b.scores[wodId]?.position || 0;
      }

      // Ordenar ascendente o descendente
      if (aValue < bValue) {
        return direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setEditableAthletes(sorted);
  };
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
            <th className="py-3 px-4 text-left w-20 rounded-tl-xl hidden md:table-cell cursor-pointer hover:bg-crossfit-secondary hover:text-white" onClick={() => handleSort('totalScore')}>#</th>
            <th className="py-3 px-4 text-left w-full md:w-40 rounded-tr-xl md:rounded-none hover:bg-crossfit-secondary cursor-pointer"
            onClick={() => handleSort('name')}>
              Atleta
            </th>
            {wods.map((wod, index) => (
              <th
                onClick={() => handleSort(`scores.${wod.id}.quantity`)}
                key={index}
                className="hidden md:table-cell py-3 px-4 text-left w-[70vw] md:w-40 cursor-pointer hover:bg-crossfit-secondary hover:text-white"
              >
                {wod.name} <FaSort className="inline ml-1" />
              </th>
            ))}
            { role !== "Athlete" && (
            <th className="hidden md:table-cell  py-3 px-4 text-left w-60 rounded-tr-xl">
              Acciones
            </th>
            )}

          </tr>
        </thead>
        <tbody className="w-full max-h-[70vh] overflow-y-auto">
          {editableAthletes.map((athlete, idx) => (
            <tr
              key={athlete.id}
              className="md:border-b w-full md:hover:bg-purple-200 odd:bg-purple-50 border-b border-b-neutral-100"
            >
              <td className="py-2 px-4 flex flex-col justify-center text-center w-20 min-h-16">
                <div className="w-fit mx-auto">
                  <AthletePosition position={athlete.position} />
                </div>
                <span className="text-xs">
                  ({athlete?.totalScore || 0} pts)
                </span>
              </td>
              <td className="md:py-2 md:px-4">
                <div className="hidden md:table-cell">
                  <p>{athlete?.name}</p>
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
                            <div className="grid grid-cols-2 gap-4 w-full">
                              <div className="w-full min-h-11">
                                <div className="flex items-center gap-2 h-full">
                                  <div className="w-fit">
                                    <AthletePosition
                                      position={
                                        athlete?.scores[wod.id]?.position
                                      }
                                    />
                                  </div>
                                  <div className="flex items-center justify-center">
                                    {athlete.scores[wod.id]?.quantity ||
                                    editingAthleteId === athlete.id ? (
                                      <AccountFields
                                        name="quantity"
                                        id={`quantity-${athlete.id}-${wod.id}`}
                                        inputType="text"
                                        value={
                                          athlete.scores[wod.id]?.quantity || ""
                                        }
                                        onChange={(e) =>
                                          handleChange(
                                            athlete.id,
                                            wod.id,
                                            "quantity",
                                            e.target.value
                                          )
                                        }
                                        allowEdit={true}
                                        isEditing={
                                          editingAthleteId === athlete.id
                                        }
                                      />
                                    ) : (
                                      <span className="pl-2 text-xs text-gray-500">
                                        <LuMinus className="text-gray-500" />
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="w-full min-h-11">
                                {athlete.scores[wod.id]?.time ||
                                editingAthleteId === athlete.id ? (
                                  <div className="flex items-center gap-2 h-full">
                                    <div className="w-fit">
                                      <TbClockBolt className="text-gray-500" />
                                    </div>
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
                                      isEditing={
                                        editingAthleteId === athlete.id
                                      }
                                    />
                                  </div>
                                ) : (
                                  <div className="flex gap-2 items-center min-w-8 w-full h-full">
                                    <Tooltip
                                      content="A la espera del tiempo del ejercicio"
                                      position="top"
                                    >
                                      <span className="text-base">
                                        <FaInfoCircle
                                          className="text-blue-400"
                                          title="A la espera del tiempo del ejercicio"
                                        />
                                      </span>
                                    </Tooltip>
                                    <div className="pl-2 flex items-center justify-center">
                                      <span className="text-xs text-gray-500">
                                        <LuMinus className="text-gray-500" />
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                        {role !== "Athlete" && (
                          <>
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
                          </>
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
                    <div className="flex items-center gap-2">
                      <div className="w-fit">
                        <AthletePosition
                          position={athlete?.scores[wod.id]?.position}
                        />
                      </div>
                      <div className="flex items-center justify-center">
                        {athlete.scores[wod.id]?.quantity ||
                        editingAthleteId === athlete.id ? (
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
                          />
                        ) : (
                          <span className="pl-2 text-xs text-gray-500">
                            <LuMinus className="text-gray-500" />
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center w-full">
                      {athlete.scores[wod.id]?.time ||
                      editingAthleteId === athlete.id ? (
                        <div className="flex items-center gap-2">
                          <div className="w-fit">
                            <TbClockBolt className="text-gray-500" />
                          </div>
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
                          />
                        </div>
                      ) : (
                        <div className="flex gap-2 items-center min-w-8 w-full">
                          <Tooltip
                            content="A la espera del tiempo del ejercicio"
                            position="top"
                          >
                            <span className="text-base">
                              <FaInfoCircle
                                className="text-blue-400"
                                title="A la espera del tiempo del ejercicio"
                              />
                            </span>
                          </Tooltip>
                          <div className="pl-2 flex items-center justify-center">
                            <span className="text-xs text-gray-500">
                              <LuMinus className="text-gray-500" />
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              ))}
              {role !== "Athlete" && (
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
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default React.memo(Leaderboard);
