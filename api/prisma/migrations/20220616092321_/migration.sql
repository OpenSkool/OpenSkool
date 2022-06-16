/*
  Warnings:

  - You are about to drop the `_CourseToInternship` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `courseId` to the `Internship` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_CourseToInternship" DROP CONSTRAINT "_CourseToInternship_A_fkey";

-- DropForeignKey
ALTER TABLE "_CourseToInternship" DROP CONSTRAINT "_CourseToInternship_B_fkey";

-- AlterTable
ALTER TABLE "Internship" ADD COLUMN     "courseId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_CourseToInternship";

-- AddForeignKey
ALTER TABLE "Internship" ADD CONSTRAINT "Internship_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
