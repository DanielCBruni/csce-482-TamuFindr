-- CreateEnum
CREATE TYPE "PrimaryColor" AS ENUM ('BLACK', 'WHITE', 'SILVER', 'GRAY', 'RED', 'BLUE', 'GREEN', 'YELLOW', 'BROWN', 'PURPLE', 'PINK', 'ORANGE', 'OTHER');

-- CreateEnum
CREATE TYPE "ItemCondition" AS ENUM ('UNKNOWN', 'NEW', 'LIKE_NEW', 'GOOD', 'FAIR', 'POOR', 'DAMAGED');

-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('PENDING', 'CONFIRMED', 'REJECTED', 'EXPIRED');

-- DropIndex
DROP INDEX "Item_storageLocationId_idx";

-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "brand" TEXT,
ADD COLUMN     "condition" "ItemCondition",
ADD COLUMN     "primaryColor" "PrimaryColor",
ADD COLUMN     "secondaryColor" "PrimaryColor",
ALTER COLUMN "description" DROP NOT NULL;

-- Preserve existing reports without inventing a known color or condition.
UPDATE "Item" SET "primaryColor" = 'OTHER', "condition" = 'UNKNOWN';
ALTER TABLE "Item" ALTER COLUMN "primaryColor" SET NOT NULL,
ALTER COLUMN "condition" SET NOT NULL;

-- CreateTable
CREATE TABLE "ItemMatch" (
    "id" TEXT NOT NULL,
    "lostItemId" TEXT NOT NULL,
    "potentialMatchId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "scoreDetails" JSONB,
    "status" "MatchStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ItemMatch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ItemMatch_lostItemId_idx" ON "ItemMatch"("lostItemId");

-- CreateIndex
CREATE INDEX "ItemMatch_potentialMatchId_idx" ON "ItemMatch"("potentialMatchId");

-- CreateIndex
CREATE INDEX "ItemMatch_status_score_idx" ON "ItemMatch"("status", "score");

-- CreateIndex
CREATE UNIQUE INDEX "ItemMatch_lostItemId_potentialMatchId_key" ON "ItemMatch"("lostItemId", "potentialMatchId");

-- CreateIndex
CREATE INDEX "Item_primaryColor_idx" ON "Item"("primaryColor");

-- AddForeignKey
ALTER TABLE "ItemMatch" ADD CONSTRAINT "ItemMatch_lostItemId_fkey" FOREIGN KEY ("lostItemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemMatch" ADD CONSTRAINT "ItemMatch_potentialMatchId_fkey" FOREIGN KEY ("potentialMatchId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
