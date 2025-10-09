/*
  Warnings:

  - You are about to drop the column `installmentProfit` on the `payment` table. All the data in the column will be lost.
  - The values [INSTALLMENT] on the enum `payment_paymentMethod` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[paymentId]` on the table `cart` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `payment` DROP COLUMN `installmentProfit`,
    MODIFY `paymentMethod` ENUM('ZARRIN_PAL', 'DIGIPAY', 'ADMIN', 'NO_METHOD') NULL;

-- CreateIndex
CREATE UNIQUE INDEX `cart_paymentId_key` ON `cart`(`paymentId`);
