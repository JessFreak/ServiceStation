/*
  Warnings:

  - Added the required column `year` to the `vehicles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "vehicles" ADD COLUMN     "year" INTEGER NOT NULL;
