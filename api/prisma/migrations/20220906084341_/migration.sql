-- DropForeignKey
ALTER TABLE "InternshipPositionMentor" DROP CONSTRAINT "InternshipPositionMentor_positionId_fkey";

-- AddForeignKey
ALTER TABLE "InternshipPositionMentor" ADD CONSTRAINT "InternshipPositionMentor_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "InternshipPosition"("id") ON DELETE CASCADE ON UPDATE CASCADE;
