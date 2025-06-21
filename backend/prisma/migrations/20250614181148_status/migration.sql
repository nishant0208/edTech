/*
  Warnings:

  - The `status` column on the `teachers` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TeacherStatus" AS ENUM ('ACTIVE', 'ON_LEAVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "teachers" DROP COLUMN "status",
ADD COLUMN     "status" "TeacherStatus" NOT NULL DEFAULT 'ACTIVE';
