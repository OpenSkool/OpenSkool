/*
  Warnings:

  - A unique constraint covering the columns `[educationId,languageCode]` on the table `EducationTranslation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Education` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Education" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Competency" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "rootCompetencyId" TEXT,
    "parentCompetencyId" TEXT,

    CONSTRAINT "Competency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompetencyTranslation" (
    "id" TEXT NOT NULL,
    "competencyId" TEXT NOT NULL,
    "languageCode" "Language" NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "CompetencyTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CompetencyTranslation_competencyId_languageCode_key" ON "CompetencyTranslation"("competencyId", "languageCode");

-- CreateIndex
CREATE UNIQUE INDEX "EducationTranslation_educationId_languageCode_key" ON "EducationTranslation"("educationId", "languageCode");

-- AddForeignKey
ALTER TABLE "Competency" ADD CONSTRAINT "Competency_rootCompetencyId_fkey" FOREIGN KEY ("rootCompetencyId") REFERENCES "Competency"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Competency" ADD CONSTRAINT "Competency_parentCompetencyId_fkey" FOREIGN KEY ("parentCompetencyId") REFERENCES "Competency"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetencyTranslation" ADD CONSTRAINT "CompetencyTranslation_competencyId_fkey" FOREIGN KEY ("competencyId") REFERENCES "Competency"("id") ON DELETE CASCADE ON UPDATE CASCADE;
