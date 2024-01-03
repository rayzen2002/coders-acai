-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "base";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "tests";

-- CreateTable
CREATE TABLE "base"."User" (
    "id" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tests"."TestUser" (
    "id" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "TestUser_pkey" PRIMARY KEY ("id")
);
