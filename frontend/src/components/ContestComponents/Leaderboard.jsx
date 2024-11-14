import React, { useEffect, useState } from "react";
import { FaSort, FaEdit, FaSave, FaTimes, FaUndo } from "react-icons/fa";
import AccountFields from "../AccountFields/AccountFields";
import { TbClockBolt, TbNumber123 } from "react-icons/tb";
import ActionButtons from "../ActionButtons/ActionButtons";
import { BiTargetLock } from "react-icons/bi";

const Leaderboard = ({ competition, wods, athletes, category }) => {
  // Estado para almacenar las filas en modo de edición
  const [editingAthleteId, setEditingAthleteId] = useState(null);
  const [editableAthletes, setEditableAthletes] = useState(athletes);
  useEffect(() => {
    if (athletes) {
      setEditableAthletes(athletes)
    }
  }, [athletes])

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
  const handleSaveClick = () => {
    // Aquí puedes enviar `editableAthletes` a tu API o backend
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

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">{competition.name} - {category?.name}</h2>
      <table className="min-w-full bg-white">
        <thead className="bg-crossfit-primary text-white">
          <tr>
            <th className="py-2 px-4 text-left w-10">#</th>
            <th className="py-2 px-4 text-left w-full md:w-40">Athlete</th>
            {wods.map((wod, index) => (
              <th key={index} className="py-2 px-4 text-left w-full md:w-40 ">
                {wod.name} <FaSort className="inline ml-1" />
              </th>
            ))}
            <th className="py-2 px-4 text-left w-full md:w-60">Acciones</th>
          </tr>
        </thead>
        <tbody className="w-full">
          {editableAthletes.map((athlete, idx) => (
            <tr key={athlete.id} className="border-b overflow-x-auto w-full">
              <td className="py-2 px-4">{idx + 1}</td>
              <td className="py-2 px-4">
                <div>
                  <p>{athlete.name}</p>
                  <p className="text-xs text-gray-500">{athlete.category}</p>
                </div>
              </td>
              {wods.map((wod) => (
                <td key={wod.id} className="py-2 px-4 w-full md:w-60">
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
              <td className="p-2 w-full md:w-64 py-3">
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
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
