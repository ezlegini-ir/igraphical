/*
  Warnings:

  - You are about to drop the column `RemoveThisColumn` on the `otp` table. All the data in the column will be lost.
  - You are about to drop the `test` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `otp` DROP COLUMN `RemoveThisColumn`;

-- DropTable
DROP TABLE `test`;
