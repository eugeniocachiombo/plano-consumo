/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_name_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT NOT NULL DEFAULT 'empty',
ADD COLUMN     "username" TEXT NOT NULL DEFAULT 'empty';

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
