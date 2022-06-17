-- CreateTable
CREATE TABLE "InternshipPosition" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "internshipInstanceId" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,

    CONSTRAINT "InternshipPosition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organisation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Organisation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_InternshipToInternshipPosition" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_InternshipToInternshipPosition_AB_unique" ON "_InternshipToInternshipPosition"("A", "B");

-- CreateIndex
CREATE INDEX "_InternshipToInternshipPosition_B_index" ON "_InternshipToInternshipPosition"("B");

-- AddForeignKey
ALTER TABLE "InternshipPosition" ADD CONSTRAINT "InternshipPosition_internshipInstanceId_fkey" FOREIGN KEY ("internshipInstanceId") REFERENCES "InternshipInstance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternshipPosition" ADD CONSTRAINT "InternshipPosition_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InternshipToInternshipPosition" ADD CONSTRAINT "_InternshipToInternshipPosition_A_fkey" FOREIGN KEY ("A") REFERENCES "Internship"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InternshipToInternshipPosition" ADD CONSTRAINT "_InternshipToInternshipPosition_B_fkey" FOREIGN KEY ("B") REFERENCES "InternshipPosition"("id") ON DELETE CASCADE ON UPDATE CASCADE;
