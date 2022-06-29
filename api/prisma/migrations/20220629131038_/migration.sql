/*
  Warnings:

  - Added the required column `descriptionLong` to the `Internship` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descriptionShort` to the `Internship` table without a default value. This is not possible if the table is not empty.
  - Added the required column `educationId` to the `Internship` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Internship` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Internship" ADD COLUMN     "descriptionLong" TEXT NOT NULL,
ADD COLUMN     "descriptionShort" TEXT NOT NULL,
ADD COLUMN     "educationId" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Internship" ADD CONSTRAINT "Internship_educationId_fkey" FOREIGN KEY ("educationId") REFERENCES "Education"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
