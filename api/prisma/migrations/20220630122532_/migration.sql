/*
  Warnings:

  - Added the required column `dateFrom` to the `Internship` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateTo` to the `Internship` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Internship" ADD COLUMN     "dateFrom" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dateTo" TIMESTAMP(3) NOT NULL;
