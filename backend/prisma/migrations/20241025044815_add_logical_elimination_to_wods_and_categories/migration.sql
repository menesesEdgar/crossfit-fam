-- AlterTable
ALTER TABLE `Category` ADD COLUMN `isDeleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Wod` ADD COLUMN `isDeleted` BOOLEAN NOT NULL DEFAULT false;
