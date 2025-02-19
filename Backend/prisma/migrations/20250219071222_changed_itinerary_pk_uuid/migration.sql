/*
  Warnings:

  - The primary key for the `Itinerary` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `Budget` DROP FOREIGN KEY `Budget_itineraryId_fkey`;

-- DropForeignKey
ALTER TABLE `Guest` DROP FOREIGN KEY `Guest_itineraryId_fkey`;

-- DropIndex
DROP INDEX `Guest_itineraryId_fkey` ON `Guest`;

-- AlterTable
ALTER TABLE `Budget` MODIFY `itineraryId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Guest` MODIFY `itineraryId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Itinerary` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `Guest` ADD CONSTRAINT `Guest_itineraryId_fkey` FOREIGN KEY (`itineraryId`) REFERENCES `Itinerary`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Budget` ADD CONSTRAINT `Budget_itineraryId_fkey` FOREIGN KEY (`itineraryId`) REFERENCES `Itinerary`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
