/*
  Warnings:

  - You are about to drop the column `rootCompetencyId` on the `Competency` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Competency" DROP CONSTRAINT "Competency_rootCompetencyId_fkey";

-- AlterTable
ALTER TABLE "Competency" DROP COLUMN "rootCompetencyId";
