/*
  Warnings:

  - You are about to drop the `Person` table. If the table is not empty, all the data it contains will be lost.

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

-- DropTable
DROP TABLE "Person";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Competency" ADD CONSTRAINT "Competency_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Competency" ADD CONSTRAINT "Competency_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetencyFramework" ADD CONSTRAINT "CompetencyFramework_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetencyFramework" ADD CONSTRAINT "CompetencyFramework_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Education" ADD CONSTRAINT "Education_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Education" ADD CONSTRAINT "Education_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
