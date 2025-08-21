/*
  Warnings:

  - You are about to drop the column `campaignId` on the `course` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[floatingBannerId]` on the table `image` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `course` DROP COLUMN `campaignId`;

-- AlterTable
ALTER TABLE `image` ADD COLUMN `floatingBannerId` INTEGER NULL,
    MODIFY `type` ENUM('POST', 'COURSE', 'ANNOUNCEMENT', 'USER', 'SLIDER', 'DOWNLOADABLE_ASSET', 'FLOATING_BANNER', 'COURSE_ASSET', 'POST_ASSET', 'TICKET_ASSET', 'OTHER') NOT NULL;

-- CreateTable
CREATE TABLE `floatingbanner` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `active` BOOLEAN NOT NULL DEFAULT false,
    `link` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `couponId` INTEGER NULL,
    `imageId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `image_floatingBannerId_key` ON `image`(`floatingBannerId`);

-- AddForeignKey
ALTER TABLE `image` ADD CONSTRAINT `image_floatingBannerId_fkey` FOREIGN KEY (`floatingBannerId`) REFERENCES `floatingbanner`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `floatingbanner` ADD CONSTRAINT `floatingbanner_couponId_fkey` FOREIGN KEY (`couponId`) REFERENCES `coupon`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
