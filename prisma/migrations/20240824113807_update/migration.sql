/*
  Warnings:

  - You are about to drop the column `email` on the `comment` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `comment` table. All the data in the column will be lost.
  - You are about to drop the column `readCount` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `readingTime` on the `post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `comment` DROP COLUMN `email`,
    DROP COLUMN `name`;

-- AlterTable
ALTER TABLE `post` DROP COLUMN `readCount`,
    DROP COLUMN `readingTime`;
