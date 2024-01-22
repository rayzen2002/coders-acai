/*
  Warnings:

  - You are about to drop the `ProductsOfOrder` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "base"."ProductsOfOrder" DROP CONSTRAINT "ProductsOfOrder_ordersId_fkey";

-- DropForeignKey
ALTER TABLE "base"."ProductsOfOrder" DROP CONSTRAINT "ProductsOfOrder_productsId_fkey";

-- DropTable
DROP TABLE "base"."ProductsOfOrder";
