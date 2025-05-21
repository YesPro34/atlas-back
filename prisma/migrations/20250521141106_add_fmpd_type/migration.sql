/*
  Warnings:

  - The values [DENTAIRE,PHARMACIE,MEDECINE] on the enum `SchoolType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SchoolType_new" AS ENUM ('ENSA', 'ENCG', 'ENSAM', 'ISPITS', 'ISPM', 'ISMALA', 'ISSS', 'EST', 'FST', 'FMPD', 'IMS', 'CPGE', 'IFMBTP');
ALTER TABLE "ecoles" ALTER COLUMN "type" TYPE "SchoolType_new" USING ("type"::text::"SchoolType_new");
ALTER TYPE "SchoolType" RENAME TO "SchoolType_old";
ALTER TYPE "SchoolType_new" RENAME TO "SchoolType";
DROP TYPE "SchoolType_old";
COMMIT;
