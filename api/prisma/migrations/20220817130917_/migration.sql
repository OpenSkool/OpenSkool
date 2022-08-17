-- CreateTable
CREATE TABLE "InternshipPositionMentor" (
    "id" TEXT NOT NULL,
    "positionId" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "InternshipPositionMentor_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InternshipPositionMentor" ADD CONSTRAINT "InternshipPositionMentor_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "InternshipPosition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
