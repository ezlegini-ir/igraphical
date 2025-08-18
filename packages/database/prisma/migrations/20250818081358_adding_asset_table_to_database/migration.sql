/*
  Warnings:

  - You are about to drop the column `description` on the `asset` table. All the data in the column will be lost.
  - You are about to drop the column `fileId` on the `asset` table. All the data in the column will be lost.
  - You are about to drop the column `imageId` on the `asset` table. All the data in the column will be lost.
  - You are about to drop the column `assetGalleryId` on the `image` table. All the data in the column will be lost.
  - You are about to drop the `assetgallery` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[url]` on the table `asset` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[assetId]` on the table `image` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fileSize` to the `asset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileUrl` to the `asset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `asset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `asset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `asset` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `asset` DROP FOREIGN KEY `asset_fileId_fkey`;

-- DropForeignKey
ALTER TABLE `asset` DROP FOREIGN KEY `asset_imageId_fkey`;

-- DropForeignKey
ALTER TABLE `assetgallery` DROP FOREIGN KEY `assetgallery_assetId_fkey`;

-- DropForeignKey
ALTER TABLE `image` DROP FOREIGN KEY `image_assetGalleryId_fkey`;

-- DropForeignKey
ALTER TABLE `posttopostcategory` DROP FOREIGN KEY `posttopostcategory_categoryId_fkey`;

-- DropIndex
DROP INDEX `asset_fileId_fkey` ON `asset`;

-- DropIndex
DROP INDEX `asset_imageId_fkey` ON `asset`;

-- DropIndex
DROP INDEX `image_assetGalleryId_fkey` ON `image`;

-- DropIndex
DROP INDEX `posttopostcategory_categoryId_fkey` ON `posttopostcategory`;

-- AlterTable
ALTER TABLE `asset` DROP COLUMN `description`,
    DROP COLUMN `fileId`,
    DROP COLUMN `imageId`,
    ADD COLUMN `fileSize` INTEGER NOT NULL,
    ADD COLUMN `fileUrl` VARCHAR(191) NOT NULL,
    ADD COLUMN `status` ENUM('PUBLISHED', 'DRAFT') NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `url` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `file` MODIFY `type` ENUM('TICKET_ASSET', 'QA_ASSET', 'CERTIFICATE', 'DOWNLOADABLE_ASSET', 'OTHER') NOT NULL;

-- AlterTable
ALTER TABLE `image` DROP COLUMN `assetGalleryId`,
    ADD COLUMN `assetId` INTEGER NULL,
    MODIFY `type` ENUM('POST', 'COURSE', 'ANNOUNCEMENT', 'USER', 'SLIDER', 'DOWNLOADABLE_ASSET', 'COURSE_ASSET', 'POST_ASSET', 'TICKET_ASSET', 'OTHER') NOT NULL;

-- DropTable
DROP TABLE `assetgallery`;

-- CreateIndex
CREATE UNIQUE INDEX `asset_url_key` ON `asset`(`url`);

-- CreateIndex
CREATE UNIQUE INDEX `image_assetId_key` ON `image`(`assetId`);

-- AddForeignKey
ALTER TABLE `image` ADD CONSTRAINT `image_assetId_fkey` FOREIGN KEY (`assetId`) REFERENCES `asset`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `posttopostcategory` ADD CONSTRAINT `posttopostcategory_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `postcategory`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
