/*
  Warnings:

  - You are about to drop the column `courseId` on the `Internship` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Internship" DROP CONSTRAINT "Internship_courseId_fkey";

-- AlterTable
ALTER TABLE "Internship" DROP COLUMN "courseId";

-- CreateTable
CREATE TABLE "_CourseToInternship" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CourseToInternship_AB_unique" ON "_CourseToInternship"("A", "B");

-- CreateIndex
CREATE INDEX "_CourseToInternship_B_index" ON "_CourseToInternship"("B");

-- AddForeignKey
ALTER TABLE "_CourseToInternship" ADD CONSTRAINT "_CourseToInternship_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToInternship" ADD CONSTRAINT "_CourseToInternship_B_fkey" FOREIGN KEY ("B") REFERENCES "Internship"("id") ON DELETE CASCADE ON UPDATE CASCADE;
