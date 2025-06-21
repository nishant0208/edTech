/*
  Warnings:

  - Added the required column `branch` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `branch` to the `teachers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "students" ADD COLUMN     "branch" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "teachers" ADD COLUMN     "branch" TEXT NOT NULL;