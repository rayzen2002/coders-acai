/*
  Warnings:

  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `TestUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "base"."User" ADD COLUMN     "username" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "tests"."TestUser" ADD COLUMN     "username" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "base"."Groups" (
    "id" TEXT NOT NULL,
    "groupName" TEXT NOT NULL,
    "levelOfAccess" INTEGER NOT NULL,

    CONSTRAINT "Groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "base"."groupsOfUser" (
    "userId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL,

    CONSTRAINT "groupsOfUser_pkey" PRIMARY KEY ("userId","groupId")
);

-- CreateTable
CREATE TABLE "tests"."TestGroups" (
    "id" TEXT NOT NULL,
    "groupName" TEXT NOT NULL,
    "levelOfAccess" INTEGER NOT NULL,

    CONSTRAINT "TestGroups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tests"."testGroupsOfUser" (
    "userId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL,

    CONSTRAINT "testGroupsOfUser_pkey" PRIMARY KEY ("userId","groupId")
);

-- AddForeignKey
ALTER TABLE "base"."groupsOfUser" ADD CONSTRAINT "groupsOfUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "base"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "base"."groupsOfUser" ADD CONSTRAINT "groupsOfUser_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "base"."Groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tests"."testGroupsOfUser" ADD CONSTRAINT "testGroupsOfUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tests"."TestUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tests"."testGroupsOfUser" ADD CONSTRAINT "testGroupsOfUser_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "tests"."TestGroups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
