/*
  Warnings:

  - You are about to drop the column `linkOpened` on the `campaign` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[url]` on the table `Campaign` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `message` to the `Campaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Campaign` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `course` DROP FOREIGN KEY `course_campaignId_fkey`;

-- DropIndex
DROP INDEX `course_campaignId_fkey` ON `course`;

-- AlterTable
ALTER TABLE `campaign` DROP COLUMN `linkOpened`,
    ADD COLUMN `message` VARCHAR(191) NOT NULL,
    ADD COLUMN `url` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Campaign_url_key` ON `Campaign`(`url`);
