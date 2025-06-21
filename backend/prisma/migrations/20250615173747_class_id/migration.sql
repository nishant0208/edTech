/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `classes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "classes_id_key" ON "classes"("id");
