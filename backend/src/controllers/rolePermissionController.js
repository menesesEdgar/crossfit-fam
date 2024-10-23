import { db } from "../lib/db.js";

export const addPermissionToRole = async (req, res) => {
  const { roleId, permissionId } = req.body;

  try {
    const rolePermission = await db.rolePermission.findUnique({
      where: {
        roleId_permissionId: {
          roleId: parseInt(roleId),
          permissionId: parseInt(permissionId),
        },
      },
    });

    if (rolePermission) {
      return res.status(200).json({ message: "El permiso ya está asignado." });
    }

    await db.rolePermission.create({
      data: {
        roleId: parseInt(roleId),
        permissionId: parseInt(permissionId),
      },
    });

    const newRolePermission = await db.rolePermission.findUnique({
      where: {
        roleId_permissionId: {
          roleId: parseInt(roleId),
          permissionId: parseInt(permissionId),
        },
      },
      include: {
        permission: true,
      },
    });

    res.status(201).json(newRolePermission);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al agregar el permiso." });
  }
};

export const removePermissionFromRole = async (req, res) => {
  const { roleId, permissionId } = req.body;

  try {
    const rolePermission = await db.rolePermission.findUnique({
      where: {
        roleId_permissionId: {
          roleId: parseInt(roleId),
          permissionId: parseInt(permissionId),
        },
      },
    });

    if (!rolePermission) {
      return res.status(404).json({ message: "El permiso no está asignado." });
    }

    await db.rolePermission.delete({
      where: {
        roleId_permissionId: {
          roleId: parseInt(roleId),
          permissionId: parseInt(permissionId),
        },
      },
    });

    res.status(200).json(rolePermission);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el permiso." });
  }
};

export const getRolePermissionByRoleId = async (req, res) => {
  const { roleId } = req.params;

  try {
    const role = await db.role.findUnique({
      where: { id: parseInt(roleId) },
    });

    if (!role) {
      return res.status(404).json({ error: "Rol no encontrado." });
    }

    const rolePermissions = await db.rolePermission.findMany({
      where: { roleId: parseInt(roleId) },
      include: {
        permission: true,
      },
    });

    res.status(200).json(rolePermissions);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener permisos del rol." });
  }
};

export const getRolePermissions = async (req, res) => {
  try {
    const rolePermissions = await db.rolePermission.findMany({
      include: {
        permission: true,
      },
    });

    res.status(200).json(rolePermissions);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener permisos." });
  }
};
