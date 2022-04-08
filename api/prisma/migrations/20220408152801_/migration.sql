-- AlterTable
ALTER TABLE "Competency" ADD COLUMN     "competencyFrameworkId" TEXT;

-- CreateTable
CREATE TABLE "CompetencyFramework" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" TEXT,

    CONSTRAINT "CompetencyFramework_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompetencyFrameworkTranslation" (
    "id" TEXT NOT NULL,
    "competencyFrameworkId" TEXT NOT NULL,
    "languageCode" "Language" NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "CompetencyFrameworkTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CompetencyFrameworkTranslation_competencyFrameworkId_langua_key" ON "CompetencyFrameworkTranslation"("competencyFrameworkId", "languageCode");

-- AddForeignKey
ALTER TABLE "Competency" ADD CONSTRAINT "Competency_competencyFrameworkId_fkey" FOREIGN KEY ("competencyFrameworkId") REFERENCES "CompetencyFramework"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetencyFramework" ADD CONSTRAINT "CompetencyFramework_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetencyFramework" ADD CONSTRAINT "CompetencyFramework_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetencyFrameworkTranslation" ADD CONSTRAINT "CompetencyFrameworkTranslation_competencyFrameworkId_fkey" FOREIGN KEY ("competencyFrameworkId") REFERENCES "CompetencyFramework"("id") ON DELETE CASCADE ON UPDATE CASCADE;
