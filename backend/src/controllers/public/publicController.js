import { db } from "../../lib/db.js";
import bcrypt from "bcryptjs";
import { generateRandomPassword } from "../../utils/generatePassword.js";

export const createPendingUser = async (req, res) => {
  try {
    const { email, firstName, lastName, gender, phone, birthDate } = req.body;

    const userExists = await db.user.findFirst({
      where: { email, enabled: true },
    });

    if (userExists) {
      return res.status(400).json({ message: "El email ya está registrado." });
    }

    const password = generateRandomPassword();

    const hashedPassword = await bcrypt.hash(password, 10);

    let athleteRol = await db.role.findFirst({
      where: { name: "Athlete" },
    });

    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        gender,
        birthdate: birthDate ? new Date(birthDate) : null,
        roleId: athleteRol?.id,
        enabled: true,
        status: "Pendiente",
      },
    });

    user.password = null;
    res.json({ user });
  } catch (error) {
    console.log("error on createUser", error);
    res.status(500).json({ message: error.message });
  }
};
