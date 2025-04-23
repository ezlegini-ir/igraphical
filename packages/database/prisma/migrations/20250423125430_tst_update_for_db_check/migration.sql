-- AlterTable
ALTER TABLE `otp` ADD COLUMN `RemoveThisColumn` VARCHAR(512) NULL DEFAULT 'RemoveThisColumn';

-- CreateTable
CREATE TABLE `test` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `test_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
