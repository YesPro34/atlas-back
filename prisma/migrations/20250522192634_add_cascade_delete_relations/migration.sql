-- DropForeignKey
ALTER TABLE "candidatures" DROP CONSTRAINT "candidatures_ecole_id_fkey";

-- DropForeignKey
ALTER TABLE "ecoles" DROP CONSTRAINT "ecoles_type_id_fkey";

-- DropForeignKey
ALTER TABLE "filiere" DROP CONSTRAINT "filiere_ecole_id_fkey";

-- AddForeignKey
ALTER TABLE "ecoles" ADD CONSTRAINT "ecoles_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "school_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "filiere" ADD CONSTRAINT "filiere_ecole_id_fkey" FOREIGN KEY ("ecole_id") REFERENCES "ecoles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidatures" ADD CONSTRAINT "candidatures_ecole_id_fkey" FOREIGN KEY ("ecole_id") REFERENCES "ecoles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
