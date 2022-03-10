-- DropForeignKey
ALTER TABLE "Competency" DROP CONSTRAINT "Competency_parentCompetencyId_fkey";

-- AddForeignKey
ALTER TABLE "Competency" ADD CONSTRAINT "Competency_parentCompetencyId_fkey" FOREIGN KEY ("parentCompetencyId") REFERENCES "Competency"("id") ON DELETE CASCADE ON UPDATE CASCADE;
