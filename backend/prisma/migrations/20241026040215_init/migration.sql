/*
  Warnings:

  - You are about to drop the column `division` on the `Category` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Category` DROP COLUMN `division`,
    ADD COLUMN `description` VARCHAR(191) NULL;
