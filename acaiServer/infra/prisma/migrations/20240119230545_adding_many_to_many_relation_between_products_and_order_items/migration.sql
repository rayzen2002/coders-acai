-- CreateTable
CREATE TABLE "base"."ProductsOnOrderItems" (
    "productsId" TEXT NOT NULL,
    "orderItemsId" TEXT NOT NULL,
    "ordersId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL,

    CONSTRAINT "ProductsOnOrderItems_pkey" PRIMARY KEY ("productsId","orderItemsId")
);

-- AddForeignKey
ALTER TABLE "base"."ProductsOnOrderItems" ADD CONSTRAINT "ProductsOnOrderItems_ordersId_fkey" FOREIGN KEY ("ordersId") REFERENCES "base"."Orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "base"."ProductsOnOrderItems" ADD CONSTRAINT "ProductsOnOrderItems_productsId_fkey" FOREIGN KEY ("productsId") REFERENCES "base"."Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "base"."ProductsOnOrderItems" ADD CONSTRAINT "ProductsOnOrderItems_orderItemsId_fkey" FOREIGN KEY ("orderItemsId") REFERENCES "base"."OrderItems"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
