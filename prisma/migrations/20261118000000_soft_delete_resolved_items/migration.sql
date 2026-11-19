ALTER TABLE "Item" ADD COLUMN "softDeletedAt" TIMESTAMP(3);

UPDATE "Item"
SET "softDeletedAt" = COALESCE("resolvedDate", "updatedAt")
WHERE "status" = 'RESOLVED';

CREATE INDEX "Item_softDeletedAt_idx" ON "Item"("softDeletedAt");
