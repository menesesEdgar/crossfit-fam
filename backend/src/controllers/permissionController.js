// controllers/permissionController.js
import { db } from "../lib/db.js";

// Obtener todos los permisos
export const getPermissions = async (req, res) => {
  try {
    const permissions = await db.permission.findMany();
    res.status(200).json(permissions);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener permisos." });
  }
};

export const getPermissionById = async (req, res) => {
  const { id } = req.params;

  try {
    const permission = await db.permission.findUnique({
      where: { id: parseInt(id) },
    });
    if (permission) {
      res.status(200).json(permission);
    } else {
      res.status(404).json({ error: "Permiso no encontrado." });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener permiso." });
  }
};

// Crear un permiso nuevo
export const createPermission = async (req, res) => {
  const { name, description } = req.body;

  try {
    const newPermission = await db.permission.create({
      data: {
        name,
        description,
      },
    });
    res.status(201).json(newPermission);
  } catch (error) {
    res.status(500).json({ error: "Error al crear permiso." });
  }
};

// Actualizar un permiso
export const updatePermission = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const updatedPermission = await db.permission.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
      },
    });
    res.status(200).json(updatedPermission);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar permiso." });
  }
};

// Eliminar un permiso
export const deletePermission = async (req, res) => {
  const { id } = req.params;

  try {
    await db.permission.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: "Permiso eliminado." });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar permiso." });
  }
};
