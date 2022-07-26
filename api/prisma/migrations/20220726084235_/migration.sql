/*
  Warnings:

  - Added the required column `variantType` to the `InternshipApplication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variantValue` to the `InternshipApplication` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InternshipApplicationVariant" AS ENUM ('Priority');

-- AlterTable
ALTER TABLE "InternshipApplication" ADD COLUMN     "variantType" "InternshipApplicationVariant" NOT NULL,
ADD COLUMN     "variantValue" JSONB NOT NULL;
