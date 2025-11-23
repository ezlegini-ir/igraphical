-- AlterTable
ALTER TABLE `payment` ADD COLUMN `campaignOnGoingId` INTEGER NULL;

-- CreateTable
CREATE TABLE `campaignongoing` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `startAt` DATETIME(3) NOT NULL,
    `endAt` DATETIME(3) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `payment` ADD CONSTRAINT `payment_campaignOnGoingId_fkey` FOREIGN KEY (`campaignOnGoingId`) REFERENCES `campaignongoing`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
