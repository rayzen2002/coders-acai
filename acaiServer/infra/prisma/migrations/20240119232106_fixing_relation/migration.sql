/*
  Warnings:

  - You are about to drop the column `ordersId` on the `ProductsOnOrderItems` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "base"."ProductsOnOrderItems" DROP CONSTRAINT "ProductsOnOrderItems_ordersId_fkey";

-- AlterTable
ALTER TABLE "base"."ProductsOnOrderItems" DROP COLUMN "ordersId";
