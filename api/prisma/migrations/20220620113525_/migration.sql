/*
  Warnings:

  - You are about to drop the column `internshipInstanceId` on the `InternshipPosition` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Internship" DROP CONSTRAINT "Internship_courseId_fkey";

-- DropForeignKey
ALTER TABLE "InternshipInstance" DROP CONSTRAINT "InternshipInstance_internshipId_fkey";

-- DropForeignKey
ALTER TABLE "InternshipPosition" DROP CONSTRAINT "InternshipPosition_internshipInstanceId_fkey";

-- DropForeignKey
ALTER TABLE "InternshipPosition" DROP CONSTRAINT "InternshipPosition_organisationId_fkey";

-- AlterTable
ALTER TABLE "InternshipPosition" DROP COLUMN "internshipInstanceId";

-- AddForeignKey
ALTER TABLE "Internship" ADD CONSTRAINT "Internship_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternshipInstance" ADD CONSTRAINT "InternshipInstance_internshipId_fkey" FOREIGN KEY ("internshipId") REFERENCES "Internship"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternshipPosition" ADD CONSTRAINT "InternshipPosition_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
