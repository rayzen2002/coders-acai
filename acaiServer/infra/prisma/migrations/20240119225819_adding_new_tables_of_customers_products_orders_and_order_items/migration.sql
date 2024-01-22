-- CreateTable
CREATE TABLE "base"."Customers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "Customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "base"."Products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT[],
    "price_in_cents" INTEGER NOT NULL,

    CONSTRAINT "Products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "base"."OrderItems" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price_in_cents" INTEGER NOT NULL,
    "ordersId" TEXT NOT NULL,

    CONSTRAINT "OrderItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "base"."Orders" (
    "id" TEXT NOT NULL,
    "total_in_cents" INTEGER NOT NULL,
    "customerId" TEXT NOT NULL,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "base"."Distributor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Distributor_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "base"."OrderItems" ADD CONSTRAINT "OrderItems_ordersId_fkey" FOREIGN KEY ("ordersId") REFERENCES "base"."Orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "base"."Orders" ADD CONSTRAINT "Orders_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "base"."Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
