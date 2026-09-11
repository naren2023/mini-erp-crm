-- CreateSchema
CREATE TYPE "Role" AS ENUM ('ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS');
CREATE TYPE "CustomerType" AS ENUM ('RETAIL', 'WHOLESALE', 'DISTRIBUTOR');
CREATE TYPE "CustomerStatus" AS ENUM ('LEAD', 'ACTIVE', 'INACTIVE');
CREATE TYPE "MovementType" AS ENUM ('IN', 'OUT');
CREATE TYPE "ChallanStatus" AS ENUM ('DRAFT', 'CONFIRMED', 'CANCELLED');

CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "gstNumber" TEXT,
    "customerType" "CustomerType" NOT NULL,
    "address" TEXT NOT NULL,
    "status" "CustomerStatus" NOT NULL DEFAULT 'LEAD',
    "followUpDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "FollowUp" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "followUpDate" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FollowUp_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "unitPrice" DECIMAL(12,2) NOT NULL,
    "currentStock" INTEGER NOT NULL DEFAULT 0,
    "minimumStock" INTEGER NOT NULL DEFAULT 0,
    "warehouseLocation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "StockMovement" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "movementType" "MovementType" NOT NULL,
    "reason" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StockMovement_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SalesChallan" (
    "id" TEXT NOT NULL,
    "challanNumber" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "totalQuantity" INTEGER NOT NULL DEFAULT 0,
    "status" "ChallanStatus" NOT NULL DEFAULT 'DRAFT',
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SalesChallan_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SalesChallanItem" (
    "id" TEXT NOT NULL,
    "challanId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productNameSnapshot" TEXT NOT NULL,
    "skuSnapshot" TEXT NOT NULL,
    "unitPriceSnapshot" DECIMAL(12,2) NOT NULL,
    "quantity" INTEGER NOT NULL,
    CONSTRAINT "SalesChallanItem_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "User_role_idx" ON "User"("role");
CREATE INDEX "Customer_status_idx" ON "Customer"("status");
CREATE INDEX "Customer_customerType_idx" ON "Customer"("customerType");
CREATE INDEX "Customer_name_idx" ON "Customer"("name");
CREATE INDEX "Customer_email_idx" ON "Customer"("email");
CREATE INDEX "Customer_followUpDate_idx" ON "Customer"("followUpDate");
CREATE INDEX "FollowUp_customerId_idx" ON "FollowUp"("customerId");
CREATE INDEX "FollowUp_followUpDate_idx" ON "FollowUp"("followUpDate");
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");
CREATE INDEX "Product_category_idx" ON "Product"("category");
CREATE INDEX "Product_currentStock_idx" ON "Product"("currentStock");
CREATE INDEX "Product_name_idx" ON "Product"("name");
CREATE INDEX "StockMovement_productId_idx" ON "StockMovement"("productId");
CREATE INDEX "StockMovement_createdAt_idx" ON "StockMovement"("createdAt");
CREATE INDEX "StockMovement_movementType_idx" ON "StockMovement"("movementType");
CREATE UNIQUE INDEX "SalesChallan_challanNumber_key" ON "SalesChallan"("challanNumber");
CREATE INDEX "SalesChallan_customerId_idx" ON "SalesChallan"("customerId");
CREATE INDEX "SalesChallan_status_idx" ON "SalesChallan"("status");
CREATE INDEX "SalesChallan_createdAt_idx" ON "SalesChallan"("createdAt");
CREATE INDEX "SalesChallanItem_challanId_idx" ON "SalesChallanItem"("challanId");
CREATE INDEX "SalesChallanItem_productId_idx" ON "SalesChallanItem"("productId");

ALTER TABLE "FollowUp" ADD CONSTRAINT "FollowUp_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "FollowUp" ADD CONSTRAINT "FollowUp_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "SalesChallan" ADD CONSTRAINT "SalesChallan_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "SalesChallan" ADD CONSTRAINT "SalesChallan_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "SalesChallanItem" ADD CONSTRAINT "SalesChallanItem_challanId_fkey" FOREIGN KEY ("challanId") REFERENCES "SalesChallan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SalesChallanItem" ADD CONSTRAINT "SalesChallanItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
