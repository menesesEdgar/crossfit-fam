/*
  Warnings:

  - You are about to alter the column `status` on the `User` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `status` ENUM('Habilitado', 'Deshabilitado', 'Pendiente') NULL DEFAULT 'Habilitado';
