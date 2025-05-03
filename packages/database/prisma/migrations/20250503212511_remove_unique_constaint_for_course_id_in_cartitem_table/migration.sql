-- DropForeignKey
ALTER TABLE `cartitem` DROP FOREIGN KEY `cartitem_courseId_fkey`;

-- DropIndex
DROP INDEX `cartitem_courseId_key` ON `cartitem`;

-- AddForeignKey
ALTER TABLE `post` ADD CONSTRAINT `post_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
