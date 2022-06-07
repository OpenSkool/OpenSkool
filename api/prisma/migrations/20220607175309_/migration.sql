/*
  Warnings:

  - You are about to drop the column `competencyFrameworkId` on the `Competency` table. All the data in the column will be lost.
  - You are about to drop the column `competencyFrameworkId` on the `CompetencyFrameworkTranslation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[frameworkId,languageCode]` on the table `CompetencyFrameworkTranslation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `frameworkId` to the `Competency` table without a default value. This is not possible if the table is not empty.
  - Added the required column `frameworkId` to the `CompetencyFrameworkTranslation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Competency" DROP CONSTRAINT "Competency_competencyFrameworkId_fkey";

-- DropForeignKey
ALTER TABLE "CompetencyFrameworkTranslation" DROP CONSTRAINT "CompetencyFrameworkTranslation_competencyFrameworkId_fkey";

-- DropIndex
DROP INDEX "CompetencyFrameworkTranslation_competencyFrameworkId_langua_key";

-- AlterTable
ALTER TABLE "Competency" DROP COLUMN "competencyFrameworkId",
ADD COLUMN     "frameworkId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CompetencyFrameworkTranslation" DROP COLUMN "competencyFrameworkId",
ADD COLUMN     "frameworkId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CompetencyFrameworkTranslation_frameworkId_languageCode_key" ON "CompetencyFrameworkTranslation"("frameworkId", "languageCode");

-- AddForeignKey
ALTER TABLE "Competency" ADD CONSTRAINT "Competency_frameworkId_fkey" FOREIGN KEY ("frameworkId") REFERENCES "CompetencyFramework"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetencyFrameworkTranslation" ADD CONSTRAINT "CompetencyFrameworkTranslation_frameworkId_fkey" FOREIGN KEY ("frameworkId") REFERENCES "CompetencyFramework"("id") ON DELETE CASCADE ON UPDATE CASCADE;
