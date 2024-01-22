-- CreateTable
CREATE TABLE "base"."ProductsOfOrder" (
    "productsId" TEXT NOT NULL,
    "ordersId" TEXT NOT NULL,

    CONSTRAINT "ProductsOfOrder_pkey" PRIMARY KEY ("productsId","ordersId")
);

-- AddForeignKey
ALTER TABLE "base"."ProductsOfOrder" ADD CONSTRAINT "ProductsOfOrder_productsId_fkey" FOREIGN KEY ("productsId") REFERENCES "base"."Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "base"."ProductsOfOrder" ADD CONSTRAINT "ProductsOfOrder_ordersId_fkey" FOREIGN KEY ("ordersId") REFERENCES "base"."Orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
