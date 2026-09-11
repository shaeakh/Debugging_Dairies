/*
  Warnings:

  - Added the required column `temporary_password` to the `Otp` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Otp" ADD COLUMN     "temporary_password" TEXT NOT NULL;
