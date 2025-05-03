/*
  Warnings:

  - A unique constraint covering the columns `[courseId,cartId]` on the table `cartitem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `cartitem_courseId_cartId_key` ON `cartitem`(`courseId`, `cartId`);
