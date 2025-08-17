/*
  Warnings:

  - You are about to drop the `campaignmessages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `campaign` DROP FOREIGN KEY `Campaign_couponId_fkey`;

-- DropForeignKey
ALTER TABLE `campaignmessages` DROP FOREIGN KEY `CampaignMessages_campaignId_fkey`;

-- AlterTable
ALTER TABLE `image` ADD COLUMN `assetGalleryId` INTEGER NULL;

-- DropTable
DROP TABLE `campaignmessages`;

-- CreateTable
CREATE TABLE `asset` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `fileId` INTEGER NOT NULL,
    `imageId` INTEGER NULL,
    `format` VARCHAR(191) NOT NULL,
    `downloadCount` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `assetgallery` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NULL,
    `assetId` INTEGER NOT NULL,

    UNIQUE INDEX `assetgallery_assetId_key`(`assetId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `campaignmessage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `smsId` INTEGER NOT NULL,
    `smsCost` INTEGER NOT NULL,
    `campaignId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `image` ADD CONSTRAINT `image_assetGalleryId_fkey` FOREIGN KEY (`assetGalleryId`) REFERENCES `assetgallery`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `asset` ADD CONSTRAINT `asset_fileId_fkey` FOREIGN KEY (`fileId`) REFERENCES `file`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `asset` ADD CONSTRAINT `asset_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `image`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assetgallery` ADD CONSTRAINT `assetgallery_assetId_fkey` FOREIGN KEY (`assetId`) REFERENCES `asset`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `campaign` ADD CONSTRAINT `campaign_couponId_fkey` FOREIGN KEY (`couponId`) REFERENCES `coupon`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `campaignmessage` ADD CONSTRAINT `campaignmessage_campaignId_fkey` FOREIGN KEY (`campaignId`) REFERENCES `campaign`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `campaign` RENAME INDEX `Campaign_url_key` TO `campaign_url_key`;
