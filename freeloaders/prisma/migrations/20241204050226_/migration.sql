/*
  Warnings:

  - Added the required column `organization_email` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "organization_email" TEXT NOT NULL;
