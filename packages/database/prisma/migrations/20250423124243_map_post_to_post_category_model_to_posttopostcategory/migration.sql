/*
  Warnings:

  - You are about to drop the `_posttopostcategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_posttopostcategory` DROP FOREIGN KEY `_posttopostcategory_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `_posttopostcategory` DROP FOREIGN KEY `_posttopostcategory_postId_fkey`;

-- DropTable
DROP TABLE `_posttopostcategory`;

-- CreateTable
CREATE TABLE `posttopostcategory` (
    `postId` INTEGER NOT NULL,
    `categoryId` INTEGER NOT NULL,

    PRIMARY KEY (`postId`, `categoryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `posttopostcategory` ADD CONSTRAINT `posttopostcategory_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `post`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `posttopostcategory` ADD CONSTRAINT `posttopostcategory_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `postcategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
