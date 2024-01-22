/*
  Warnings:

  - You are about to drop the `OrderItems` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductsOnOrderItems` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "base"."OrderItems" DROP CONSTRAINT "OrderItems_ordersId_fkey";

-- DropForeignKey
ALTER TABLE "base"."ProductsOnOrderItems" DROP CONSTRAINT "ProductsOnOrderItems_orderItemsId_fkey";

-- DropForeignKey
ALTER TABLE "base"."ProductsOnOrderItems" DROP CONSTRAINT "ProductsOnOrderItems_productsId_fkey";

-- DropTable
DROP TABLE "base"."OrderItems";

-- DropTable
DROP TABLE "base"."ProductsOnOrderItems";
