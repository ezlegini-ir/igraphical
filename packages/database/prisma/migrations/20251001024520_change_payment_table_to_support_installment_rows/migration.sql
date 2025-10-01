/*
  Warnings:

  - You are about to alter the column `paymentMethod` on the `payment` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(23))` to `Enum(EnumId(14))`.

*/
-- AlterTable
ALTER TABLE `payment` ADD COLUMN `installmentProfit` DOUBLE NULL,
    MODIFY `paymentMethod` ENUM('ZARRIN_PAL', 'INSTALLMENT', 'ADMIN', 'NO_METHOD') NULL;
