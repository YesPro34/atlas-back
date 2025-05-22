-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'REGISTERED');

-- CreateEnum
CREATE TYPE "ChoiceType" AS ENUM ('CITY', 'FILIERE');

-- CreateTable
CREATE TABLE "utilisateurs" (
    "id" TEXT NOT NULL,
    "massar_code" TEXT NOT NULL,
    "mot_de_passe" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "hashed_refresh_token" TEXT,
    "etat" "UserStatus" NOT NULL DEFAULT 'INACTIVE',
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "bacOptionId" TEXT,
    "ville" TEXT,
    "note_national" DOUBLE PRECISION,
    "moyenne_general" DOUBLE PRECISION,
    "note_math" DOUBLE PRECISION,
    "note_physique" DOUBLE PRECISION,
    "note_svt" DOUBLE PRECISION,
    "note_anglais" DOUBLE PRECISION,
    "note_philosophie" DOUBLE PRECISION,

    CONSTRAINT "utilisateurs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "school_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "max_cities" INTEGER,
    "requires_city_ranking" BOOLEAN NOT NULL DEFAULT false,
    "max_filieres" INTEGER,
    "allow_multiple_filieres_selection" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "school_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ecoles" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "type_id" TEXT NOT NULL,
    "est_ouverte" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ecoles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "filiere" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "ecole_id" TEXT NOT NULL,

    CONSTRAINT "filiere_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "candidatures" (
    "id" TEXT NOT NULL,
    "utilisateur_id" TEXT NOT NULL,
    "ecole_id" TEXT NOT NULL,
    "statut" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "date_candidature" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_mise_a_jour" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "candidatures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "choix_candidature" (
    "id" TEXT NOT NULL,
    "candidature_id" TEXT NOT NULL,
    "rang" INTEGER NOT NULL,
    "ville_ecole_id" TEXT,
    "filiere_id" TEXT,
    "type_choix" "ChoiceType" NOT NULL DEFAULT 'FILIERE',
    "ville_id" TEXT,

    CONSTRAINT "choix_candidature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "City" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BacOption" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "BacOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CitySchools" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CitySchools_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_SchoolBacOptions" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SchoolBacOptions_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_FiliereBacOptions" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_FiliereBacOptions_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "utilisateurs_massar_code_key" ON "utilisateurs"("massar_code");

-- CreateIndex
CREATE UNIQUE INDEX "school_types_name_key" ON "school_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "school_types_code_key" ON "school_types"("code");

-- CreateIndex
CREATE UNIQUE INDEX "candidatures_utilisateur_id_ecole_id_key" ON "candidatures"("utilisateur_id", "ecole_id");

-- CreateIndex
CREATE UNIQUE INDEX "choix_candidature_candidature_id_rang_key" ON "choix_candidature"("candidature_id", "rang");

-- CreateIndex
CREATE UNIQUE INDEX "City_nom_key" ON "City"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "BacOption_name_key" ON "BacOption"("name");

-- CreateIndex
CREATE INDEX "_CitySchools_B_index" ON "_CitySchools"("B");

-- CreateIndex
CREATE INDEX "_SchoolBacOptions_B_index" ON "_SchoolBacOptions"("B");

-- CreateIndex
CREATE INDEX "_FiliereBacOptions_B_index" ON "_FiliereBacOptions"("B");

-- AddForeignKey
ALTER TABLE "utilisateurs" ADD CONSTRAINT "utilisateurs_bacOptionId_fkey" FOREIGN KEY ("bacOptionId") REFERENCES "BacOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ecoles" ADD CONSTRAINT "ecoles_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "school_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "filiere" ADD CONSTRAINT "filiere_ecole_id_fkey" FOREIGN KEY ("ecole_id") REFERENCES "ecoles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidatures" ADD CONSTRAINT "candidatures_utilisateur_id_fkey" FOREIGN KEY ("utilisateur_id") REFERENCES "utilisateurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidatures" ADD CONSTRAINT "candidatures_ecole_id_fkey" FOREIGN KEY ("ecole_id") REFERENCES "ecoles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "choix_candidature" ADD CONSTRAINT "choix_candidature_candidature_id_fkey" FOREIGN KEY ("candidature_id") REFERENCES "candidatures"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "choix_candidature" ADD CONSTRAINT "choix_candidature_filiere_id_fkey" FOREIGN KEY ("filiere_id") REFERENCES "filiere"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "choix_candidature" ADD CONSTRAINT "choix_candidature_ville_id_fkey" FOREIGN KEY ("ville_id") REFERENCES "City"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CitySchools" ADD CONSTRAINT "_CitySchools_A_fkey" FOREIGN KEY ("A") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CitySchools" ADD CONSTRAINT "_CitySchools_B_fkey" FOREIGN KEY ("B") REFERENCES "ecoles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SchoolBacOptions" ADD CONSTRAINT "_SchoolBacOptions_A_fkey" FOREIGN KEY ("A") REFERENCES "BacOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SchoolBacOptions" ADD CONSTRAINT "_SchoolBacOptions_B_fkey" FOREIGN KEY ("B") REFERENCES "ecoles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FiliereBacOptions" ADD CONSTRAINT "_FiliereBacOptions_A_fkey" FOREIGN KEY ("A") REFERENCES "BacOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FiliereBacOptions" ADD CONSTRAINT "_FiliereBacOptions_B_fkey" FOREIGN KEY ("B") REFERENCES "filiere"("id") ON DELETE CASCADE ON UPDATE CASCADE;
