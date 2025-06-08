/*
  Warnings:

  - You are about to drop the column `releaseData` on the `course` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `course` DROP COLUMN `releaseData`,
    ADD COLUMN `releaseDate` DATETIME(3) NULL;
