/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Competency" DROP CONSTRAINT "Competency_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Competency" DROP CONSTRAINT "Competency_updatedById_fkey";

-- DropForeignKey
ALTER TABLE "CompetencyFramework" DROP CONSTRAINT "CompetencyFramework_createdById_fkey";

-- DropForeignKey
ALTER TABLE "CompetencyFramework" DROP CONSTRAINT "CompetencyFramework_updatedById_fkey";

-- DropForeignKey
ALTER TABLE "Education" DROP CONSTRAINT "Education_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Education" DROP CONSTRAINT "Education_updatedById_fkey";

-- DropForeignKey
ALTER TABLE "InternshipInstance" DROP CONSTRAINT "InternshipInstance_studentId_fkey";

-- DropTable
DROP TABLE "User";
