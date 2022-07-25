/*
  Warnings:

  - You are about to drop the column `assignedPositionId` on the `InternshipInstance` table. All the data in the column will be lost.
  - You are about to drop the `_InternshipInstancesAppliedPositions` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[assignedId]` on the table `InternshipInstance` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "InternshipInstance" DROP CONSTRAINT "InternshipInstance_assignedPositionId_fkey";

-- DropForeignKey
ALTER TABLE "_InternshipInstancesAppliedPositions" DROP CONSTRAINT "_InternshipInstancesAppliedPositions_A_fkey";

-- DropForeignKey
ALTER TABLE "_InternshipInstancesAppliedPositions" DROP CONSTRAINT "_InternshipInstancesAppliedPositions_B_fkey";

-- AlterTable
ALTER TABLE "InternshipInstance" DROP COLUMN "assignedPositionId",
ADD COLUMN     "assignedId" TEXT;

-- DropTable
DROP TABLE "_InternshipInstancesAppliedPositions";

-- CreateTable
CREATE TABLE "InternshipApplication" (
    "instanceId" TEXT NOT NULL,
    "positionId" TEXT NOT NULL,

    CONSTRAINT "InternshipApplication_pkey" PRIMARY KEY ("instanceId","positionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "InternshipInstance_assignedId_key" ON "InternshipInstance"("assignedId");

-- AddForeignKey
ALTER TABLE "InternshipApplication" ADD CONSTRAINT "InternshipApplication_instanceId_fkey" FOREIGN KEY ("instanceId") REFERENCES "InternshipInstance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternshipApplication" ADD CONSTRAINT "InternshipApplication_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "InternshipPosition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternshipInstance" ADD CONSTRAINT "InternshipInstance_assignedId_fkey" FOREIGN KEY ("assignedId") REFERENCES "InternshipPosition"("id") ON DELETE SET NULL ON UPDATE CASCADE;
