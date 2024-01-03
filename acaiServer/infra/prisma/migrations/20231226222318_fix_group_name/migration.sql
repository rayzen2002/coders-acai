/*
  Warnings:

  - You are about to drop the `groupsOfUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `testGroupsOfUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "base"."groupsOfUser" DROP CONSTRAINT "groupsOfUser_groupId_fkey";

-- DropForeignKey
ALTER TABLE "base"."groupsOfUser" DROP CONSTRAINT "groupsOfUser_userId_fkey";

-- DropForeignKey
ALTER TABLE "tests"."testGroupsOfUser" DROP CONSTRAINT "testGroupsOfUser_groupId_fkey";

-- DropForeignKey
ALTER TABLE "tests"."testGroupsOfUser" DROP CONSTRAINT "testGroupsOfUser_userId_fkey";

-- DropTable
DROP TABLE "base"."groupsOfUser";

-- DropTable
DROP TABLE "tests"."testGroupsOfUser";

-- CreateTable
CREATE TABLE "base"."GroupsOfUser" (
    "userId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL,

    CONSTRAINT "GroupsOfUser_pkey" PRIMARY KEY ("userId","groupId")
);

-- CreateTable
CREATE TABLE "tests"."TestGroupsOfUser" (
    "userId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL,

    CONSTRAINT "TestGroupsOfUser_pkey" PRIMARY KEY ("userId","groupId")
);

-- AddForeignKey
ALTER TABLE "base"."GroupsOfUser" ADD CONSTRAINT "GroupsOfUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "base"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "base"."GroupsOfUser" ADD CONSTRAINT "GroupsOfUser_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "base"."Groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tests"."TestGroupsOfUser" ADD CONSTRAINT "TestGroupsOfUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tests"."TestUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tests"."TestGroupsOfUser" ADD CONSTRAINT "TestGroupsOfUser_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "tests"."TestGroups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
