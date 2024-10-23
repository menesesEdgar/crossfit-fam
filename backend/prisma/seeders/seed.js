import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

const database = new PrismaClient();

async function main() {
  const roles = await database.role.findMany();
  if (roles.length === 0) {
    const rootRole = await database.role.create({
        data: {
          name: "Root",
        },
    });
    const adminRole = await database.role.create({
      data: {
        name: "Admin",
      },
    });
    await database.role.createMany({
        data: [
          { name: "Athlete" },
        ],
    });
    const permissions = [
      { name: "view_dashboard", description: "Ver el panel de control" },
      { name: "view_account", description: "Ver la cuenta" },
      { name: "edit_account", description: "Editar información de la cuenta" },
      { name: "change_password", description: "Cambiar contraseña" },
      { name: "change_account_image", description: "Cambiar imagen de perfil" },
      { name: "view_users", description: "Ver usuarios" },
      { name: "create_users", description: "Crear usuarios" },
      { name: "edit_users", description: "Editar usuarios" },
      { name: "delete_users", description: "Eliminar usuarios" },
      { name: "view_roles", description: "Ver roles" },
      { name: "create_roles", description: "Crear roles" },
      { name: "edit_roles", description: "Editar roles" },
      { name: "delete_roles", description: "Eliminar roles" },
      { name: "view_categories", description: "Ver categorías" },
      { name: "create_category", description: "Crear categoría" },
      { name: "edit_category", description: "Editar categoría" },
      { name: "delete_category", description: "Eliminar categoría" },
      { name: "view_wods", description: "Ver Wods" },
      { name: "create_wod", description: "Crear Wod" },
      { name: "edit_wod", description: "Editar Wod" },
      { name: "delete_wod", description: "Eliminar Wod" },
      { name: "view_contest", description: "Ver competencias" },
      { name: "create_contest", description: "Crear competencia" },
      { name: "edit_contest", description: "Editar competencia" },
      { name: "delete_contest", description: "Eliminar competencia" },
      { name: "view_scores", description: "Ver puntajes" },
      { name: "create_score", description: "Crear puntaje" },
      { name: "edit_score", description: "Editar puntaje" },
      { name: "delete_score", description: "Eliminar puntaje" },
      { name: "view_athletes", description: "Ver atletas" },
      { name: "create_athlete", description: "Crear atleta" },
      { name: "edit_athlete", description: "Editar atleta" },
      { name: "delete_athlete", description: "Eliminar atleta" },
    ];
    // Create all permission to the permissions table
    const createdPermissions = await Promise.all(
      permissions.map((perm) =>
        database.permission.create({
          data: perm,
        })
      )
    );
    // Assing all permissioins to the root user
    await Promise.all(
      createdPermissions.map((perm) =>
        database.rolePermission.create({
          data: {
            roleId: rootRole.id,
            permissionId: perm.id,
          },
        })
      )
    );
    // Assing all permissioins to the admin user
    await Promise.all(
      createdPermissions.map((perm) =>
        database.rolePermission.create({
          data: {
            roleId: adminRole.id,
            permissionId: perm.id,
          },
        })
      )
    );
    const hashedPasswordAdmin = await bcrypt.hash("admin123", 10);

    const uuidUser1 = uuidv4();
    const user1 = await database.user.create({
      data: {
        id: uuidUser1,
        firstName: "Family",
        lastName: "Crossfit",
        email: "family@crossfit.com",
        password: hashedPasswordAdmin,
        roleId: rootRole.id,
        enabled: true,
      },
    });

    console.log({ user1 });
  } else {
    console.log("Los datos ya existen en la base de datos.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await database.$disconnect();
  });
