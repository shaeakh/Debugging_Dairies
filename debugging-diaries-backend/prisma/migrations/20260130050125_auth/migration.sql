/*
  Warnings:

  - You are about to drop the column `email` on the `Auth` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Auth` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Auth` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Auth` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Auth" DROP CONSTRAINT "Auth_username_fkey";

-- DropIndex
DROP INDEX "Auth_email_key";

-- DropIndex
DROP INDEX "Auth_username_key";

-- AlterTable
ALTER TABLE "Auth" DROP COLUMN "email",
DROP COLUMN "username",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Auth_userId_key" ON "Auth"("userId");

-- AddForeignKey
ALTER TABLE "Auth" ADD CONSTRAINT "Auth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
