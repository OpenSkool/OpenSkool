-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'EXTERNAL', 'STUDENT', 'TEACHER');

-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);
