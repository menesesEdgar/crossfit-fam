import { db } from "../lib/db.js";
import bcrypt from "bcryptjs";
import { parseStatus } from "../utils/generateToken.js";
import { generateRandomPassword } from "../utils/generatePassword.js";

export const getUsers = async (req, res) => {
  try {
    const users = await db.user.findMany();
    res.json(users);
  } catch (error) {
    console.log("error on getUsers", error);
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await db.user.findUnique({
      where: { id, enabled: true },
      include: {
        role: true,
        photo: {
          where: { enabled: true },
        },
      },
    });

    if (user) {
      user.password = undefined;
      res.json(user);
    } else {
      res.status(404).json({ message: "Usuario no encontrado." });
    }
  } catch (error) {
    console.log("error on getUserById", error);
    res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      role,
      birthDate,
      gender,
      password,
    } = req.body;

    const userExists = await db.user.findFirst({
      where: { email, enabled: true },
    });

    if (userExists) {
      return res.status(400).json({ message: "El email ya está registrado." });
    }

    const newPassword =
      role === "Athlete" ? generateRandomPassword() : password;

    let athleteRol;
    if (role === "Athlete") {
      athleteRol = await db.role.findFirst({
        where: { name: "Athlete" },
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const createdUser = await db.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        birthdate: birthDate ? new Date(birthDate) : null,
        gender,
        password: hashedPassword,
        roleId: role === "Athlete" ? athleteRol.id : parseInt(role),
        enabled: true,
        status: true,
      },
    });

    const newUser = await db.user.findUnique({
      where: { id: createdUser.id },
      include: {
        role: true,
      },
    });

    newUser.password = role === "Athlete" ? newPassword : undefined;

    res.status(201).json(newUser);
  } catch (error) {
    console.log("error on createUser", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const {
      id,
      firstName,
      lastName,
      email,
      phone,
      role,
      status,
      birthDate,
      gender,
    } = req.body;

    const userExists = await db.user.findFirst({ where: { id } });

    if (!userExists) {
      return res.status(400).json({ message: "El usuario no existe." });
    }

    const emailExists = await db.user.findFirst({
      where: { email, NOT: { id }, enabled: true },
    });

    if (emailExists) {
      return res.status(400).json({ message: "El email ya está registrado." });
    }

    const updatedUser = await db.user.update({
      where: { id },
      data: {
        firstName,
        lastName,
        email,
        phone,
        birthdate: birthDate ? new Date(birthDate) : null,
        gender: gender || null,
        status: parseStatus(status),
        roleId: parseInt(role),
      },
      include: {
        role: true,
      },
    });

    const newUser = await db.user.findUnique({
      where: { id: updatedUser.id },
      include: {
        role: true,
        photo: {
          where: { enabled: true },
        },
      },
    });

    newUser.password = undefined;

    return res.json(newUser);
  } catch (error) {
    console.log("error on updateUser", error);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const userExists = await db.user.findFirst({ where: { id } });

    if (!userExists) {
      return res.status(400).json({ message: "El usuario no existe." });
    }

    const user = await db.user.findUnique({
      where: { id },
    });

    const email = user.email;
    const emailParts = email.split("@");
    const newEmail = `rm_${emailParts[0]}@${emailParts[1]}`;

    await db.user.update({
      where: { id },
      data: { enabled: false, email: newEmail },
    });

    res.json({ message: "Usuario eliminado." });
  } catch (error) {
    console.log("error on deleteUser", error);
    return res.status(500).json({ message: error.message });
  }
};

export const changeUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    res.json({ message: "Contraseña actualizada." });
  } catch (error) {
    console.log("error on changeUserPassword", error);
    return res.status(500).json({ message: error.message });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const {
      searchTerm,
      sortBy,
      order = "asc",
      page = 1,
      pageSize = 10,
      role,
    } = req.query;
    const { user: currentUser } = req;
    const validSortColumns = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "role",
    ];

    const textSearchConditions = searchTerm
      ? {
          OR: [
            { firstName: { contains: searchTerm } },
            { lastName: { contains: searchTerm } },
            { email: { contains: searchTerm } },
            { phone: { contains: searchTerm } },
            { role: { name: { contains: searchTerm } } },
          ],
        }
      : {};

    const formSortBy = (value, order) => {
      let arr = value.split(".");
      let obj = {};
      if (arr.length === 3) {
        obj = {
          [arr[0]]: {
            [arr[1]]: {
              [arr[2]]: order,
            },
          },
        };
      } else if (arr.length === 2) {
        obj = {
          [arr[0]]: {
            [arr[1]]: order,
          },
        };
      } else {
        obj = {
          [arr[0]]: order,
        };
      }
      return obj;
    };

    const orderField = validSortColumns.includes(sortBy) ? sortBy : "firstName";
    const orderDirection = order === "asc" ? "asc" : "desc";
    const skip = (page - 1) * pageSize;
    const take = parseInt(pageSize);
    const athleteRol = role
      ? { name: { not: "Root", equals: "Athlete" } }
      : { name: { not: "Root" } };
    const whereConditions = {
      ...textSearchConditions,
      enabled: true,
      role: athleteRol,
    };

    const users = await db.user.findMany({
      where: whereConditions,
      include: {
        role: true,
        photo: {
          where: { enabled: true },
        },
      },
      orderBy: formSortBy(orderField, orderDirection),
      skip,
      take,
    });

    const usersWithoutPassword = users?.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    const totalRecords = await db.user.count({
      where: whereConditions,
    });

    const totalPages = Math.ceil(totalRecords / pageSize);

    return res.json({
      data: usersWithoutPassword,
      pagination: {
        totalRecords,
        totalPages,
        currentPage: parseInt(page),
        pageSize: parseInt(pageSize),
      },
    });
  } catch (error) {
    console.log("error on searchUsers", error);
    return res.status(500).json({ message: error.message });
  }
};
