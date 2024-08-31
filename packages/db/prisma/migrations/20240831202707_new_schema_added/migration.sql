/*
  Warnings:

  - Added the required column `auth_type` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "onRampStatus" AS ENUM ('Success', 'Failure', 'Processing');

-- AlterEnum
ALTER TYPE "AuthType" ADD VALUE 'Email';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "auth_type" "AuthType" NOT NULL;

-- CreateTable
CREATE TABLE "Balance" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "locked" INTEGER NOT NULL,

    CONSTRAINT "Balance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "onRampTransaction" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "status" "onRampStatus" NOT NULL,
    "token" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "amoutn" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "onRampTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Balance_userId_key" ON "Balance"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "onRampTransaction_userId_key" ON "onRampTransaction"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "onRampTransaction_token_key" ON "onRampTransaction"("token");

-- AddForeignKey
ALTER TABLE "Balance" ADD CONSTRAINT "Balance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onRampTransaction" ADD CONSTRAINT "onRampTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
