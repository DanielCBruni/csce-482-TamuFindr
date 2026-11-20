-- CreateEnum
CREATE TYPE "ItemKindSource" AS ENUM ('USER', 'STAFF', 'RULE', 'MODEL');

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "itemKindConfidence" DOUBLE PRECISION,
ADD COLUMN     "itemKindId" TEXT,
ADD COLUMN     "itemKindSource" "ItemKindSource";

-- CreateTable
CREATE TABLE "ItemKind" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "parentId" TEXT,

    CONSTRAINT "ItemKind_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ItemKind_slug_key" ON "ItemKind"("slug");

-- CreateIndex
CREATE INDEX "ItemKind_categoryId_idx" ON "ItemKind"("categoryId");

-- CreateIndex
CREATE INDEX "ItemKind_parentId_idx" ON "ItemKind"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "ItemKind_categoryId_name_key" ON "ItemKind"("categoryId", "name");

-- AddForeignKey
ALTER TABLE "ItemKind" ADD CONSTRAINT "ItemKind_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemKind" ADD CONSTRAINT "ItemKind_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ItemKind"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_itemKindId_fkey" FOREIGN KEY ("itemKindId") REFERENCES "ItemKind"("id") ON DELETE SET NULL ON UPDATE CASCADE;
