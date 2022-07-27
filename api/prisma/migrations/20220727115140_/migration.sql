/*
  Warnings:

  - You are about to drop the column `assignedId` on the `InternshipInstance` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[assignedPositionId]` on the table `InternshipInstance` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "InternshipInstance" DROP CONSTRAINT "InternshipInstance_assignedId_fkey";

-- DropIndex
DROP INDEX "InternshipInstance_assignedId_key";

-- AlterTable
ALTER TABLE "InternshipInstance" DROP COLUMN "assignedId",
ADD COLUMN     "assignedPositionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "InternshipInstance_assignedPositionId_key" ON "InternshipInstance"("assignedPositionId");

-- AddForeignKey
ALTER TABLE "InternshipInstance" ADD CONSTRAINT "InternshipInstance_assignedPositionId_fkey" FOREIGN KEY ("assignedPositionId") REFERENCES "InternshipPosition"("id") ON DELETE SET NULL ON UPDATE CASCADE;
