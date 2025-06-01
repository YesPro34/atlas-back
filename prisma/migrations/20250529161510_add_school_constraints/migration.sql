-- AlterTable
ALTER TABLE "ecoles" ADD COLUMN     "allow_multiple_filieres_selection" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "max_filieres" INTEGER;
