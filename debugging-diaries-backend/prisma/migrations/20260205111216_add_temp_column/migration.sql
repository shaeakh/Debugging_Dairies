-- AlterTable
ALTER TABLE "Auth" ADD COLUMN     "password_last_modification_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
