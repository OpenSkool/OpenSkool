/*
  Warnings:

  - You are about to drop the column `summary` on the `InternshipPosition` table. All the data in the column will be lost.
  - Added the required column `description` to the `InternshipPosition` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InternshipInstance" ADD COLUMN     "assignedPositionId" TEXT;

-- AlterTable
ALTER TABLE "InternshipPosition" DROP COLUMN "summary",
ADD COLUMN     "description" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "_InternshipInstancesAppliedPositions" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_InternshipInstancesAppliedPositions_AB_unique" ON "_InternshipInstancesAppliedPositions"("A", "B");

-- CreateIndex
CREATE INDEX "_InternshipInstancesAppliedPositions_B_index" ON "_InternshipInstancesAppliedPositions"("B");

-- AddForeignKey
ALTER TABLE "InternshipInstance" ADD CONSTRAINT "InternshipInstance_assignedPositionId_fkey" FOREIGN KEY ("assignedPositionId") REFERENCES "InternshipPosition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InternshipInstancesAppliedPositions" ADD CONSTRAINT "_InternshipInstancesAppliedPositions_A_fkey" FOREIGN KEY ("A") REFERENCES "InternshipInstance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InternshipInstancesAppliedPositions" ADD CONSTRAINT "_InternshipInstancesAppliedPositions_B_fkey" FOREIGN KEY ("B") REFERENCES "InternshipPosition"("id") ON DELETE CASCADE ON UPDATE CASCADE;
