/*
  Warnings:

  - You are about to drop the `TestGroups` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TestGroupsOfUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TestUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "tests"."TestGroupsOfUser" DROP CONSTRAINT "TestGroupsOfUser_groupId_fkey";

-- DropForeignKey
ALTER TABLE "tests"."TestGroupsOfUser" DROP CONSTRAINT "TestGroupsOfUser_userId_fkey";

-- DropTable
DROP TABLE "tests"."TestGroups";

-- DropTable
DROP TABLE "tests"."TestGroupsOfUser";

-- DropTable
DROP TABLE "tests"."TestUser";
