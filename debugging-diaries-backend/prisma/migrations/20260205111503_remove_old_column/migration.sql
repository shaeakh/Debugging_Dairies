/*
  Warnings:

  - You are about to drop the column `password_last_modification_time` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "password_last_modification_time";
