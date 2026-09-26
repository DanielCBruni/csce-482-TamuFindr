/*
  Warnings:

  - You are about to drop the column `foundLocationExtra` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `foundLocationId` on the `Item` table. All the data in the column will be lost.
  - Added the required column `locationId` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_foundLocationId_fkey";

-- DropIndex
DROP INDEX "Item_foundLocationId_idx";

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "foundLocationExtra",
DROP COLUMN "foundLocationId",
ADD COLUMN     "locationExtra" TEXT,
ADD COLUMN     "locationId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Item_locationId_idx" ON "Item"("locationId");

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
