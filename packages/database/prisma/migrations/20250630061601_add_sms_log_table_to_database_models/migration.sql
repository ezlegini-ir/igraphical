/*
  Warnings:

  - You are about to drop the column `test` on the `course` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `posttopostcategory` DROP FOREIGN KEY `posttopostcategory_postId_fkey`;

-- AlterTable
ALTER TABLE `course` DROP COLUMN `test`;

-- AlterTable
ALTER TABLE `post` MODIFY `content` LONGTEXT NOT NULL;

-- CreateTable
CREATE TABLE `smsLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sentAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `type` ENUM('REMIND_PENDING_ENROLLMENT') NOT NULL,
    `enrollmentId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `posttopostcategory` ADD CONSTRAINT `posttopostcategory_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `smsLog` ADD CONSTRAINT `smsLog_enrollmentId_fkey` FOREIGN KEY (`enrollmentId`) REFERENCES `enrollment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
