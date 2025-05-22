-- DropForeignKey
ALTER TABLE "candidatures" DROP CONSTRAINT "candidatures_utilisateur_id_fkey";

-- AddForeignKey
ALTER TABLE "candidatures" ADD CONSTRAINT "candidatures_utilisateur_id_fkey" FOREIGN KEY ("utilisateur_id") REFERENCES "utilisateurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
