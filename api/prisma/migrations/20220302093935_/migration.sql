/*
  Warnings:

  - You are about to drop the column `name` on the `Education` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Language" AS ENUM ('EN');

-- AlterTable
ALTER TABLE "Education" DROP COLUMN "name";

-- CreateTable
CREATE TABLE "EducationTranslation" (
    "id" TEXT NOT NULL,
    "educationId" TEXT NOT NULL,
    "languageCode" "Language" NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "EducationTranslation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EducationTranslation" ADD CONSTRAINT "EducationTranslation_educationId_fkey" FOREIGN KEY ("educationId") REFERENCES "Education"("id") ON DELETE CASCADE ON UPDATE CASCADE;
