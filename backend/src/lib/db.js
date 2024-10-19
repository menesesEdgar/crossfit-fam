import { PrismaClient } from "@prisma/client";


export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}

// We are using globalThis because is not detected by hot reload, this help us to avoid issues

// This way to declare help us to avoid crash our backend
