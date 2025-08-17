-- AlterTable
ALTER TABLE `campaign` ADD COLUMN `campaignCost` INTEGER NULL,
    ADD COLUMN `messageDelivered` INTEGER NULL;

-- CreateTable
CREATE TABLE `CampaignMessages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `smsId` INTEGER NOT NULL,
    `smsCost` INTEGER NOT NULL,
    `campaignId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CampaignMessages` ADD CONSTRAINT `CampaignMessages_campaignId_fkey` FOREIGN KEY (`campaignId`) REFERENCES `Campaign`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
