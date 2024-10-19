import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

const database = new PrismaClient();

async function main() {
  if (roles.length === 0) {
    const rootRole = await database.role.create({
        data: {
          name: "root",
        },
    });
    await database.role.createMany({
        data: [

          { name: "admin" },
          { name: "athlete" },
        ],
    });

    const hashedPasswordAdmin = await bcrypt.hash("admin123", 10);

    const uuidUser1 = uuidv4();
    const user1 = await database.user.create({
      data: {
        id: uuidUser1,
        firstName: "Family",
        lastName: "Crossfit",
        email: "family@crossfit.mx",
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
