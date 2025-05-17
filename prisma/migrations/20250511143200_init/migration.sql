-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'ADMIN');

-- CreateEnum
CREATE TYPE "BacOption" AS ENUM ('PC', 'SVT', 'SMA', 'ECO', 'SMB', 'STE', 'STM', 'SGC');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'REGISTERED');

-- CreateEnum
CREATE TYPE "SchoolType" AS ENUM ('ENSA', 'EST', 'ENCG', 'ENSAM', 'ISPITS', 'ISSS', 'ISPM', 'MEDICAL');

-- CreateTable
CREATE TABLE "utilisateurs" (
    "id" TEXT NOT NULL,
    "massar_code" TEXT NOT NULL,
    "mot_de_passe" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "hashedRefreshToken" TEXT,
    "etat" "UserStatus" NOT NULL DEFAULT 'INACTIVE',
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "option_bac" "BacOption",
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
CREATE TABLE "City" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ecoles" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "type" "SchoolType" NOT NULL,
    "option_bac_autorise" "BacOption"[],
    "est_ouverte" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ecoles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ville_jointure_ecole" (
    "id" TEXT NOT NULL,
    "ville_id" TEXT NOT NULL,
    "ecole_id" TEXT NOT NULL,

    CONSTRAINT "ville_jointure_ecole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "filiere" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "ecole_id" TEXT NOT NULL,

    CONSTRAINT "filiere_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applications" (
    "id" TEXT NOT NULL,
    "utilisateur_id" TEXT NOT NULL,
    "city_school_id" TEXT,
    "filiere_id" TEXT,
    "groupe_ecole" "SchoolType" NOT NULL,
    "rang" INTEGER,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "utilisateurs_massar_code_key" ON "utilisateurs"("massar_code");

-- CreateIndex
CREATE UNIQUE INDEX "ville_jointure_ecole_ville_id_ecole_id_key" ON "ville_jointure_ecole"("ville_id", "ecole_id");

-- CreateIndex
CREATE UNIQUE INDEX "applications_utilisateur_id_groupe_ecole_rang_key" ON "applications"("utilisateur_id", "groupe_ecole", "rang");

-- AddForeignKey
ALTER TABLE "ville_jointure_ecole" ADD CONSTRAINT "ville_jointure_ecole_ville_id_fkey" FOREIGN KEY ("ville_id") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ville_jointure_ecole" ADD CONSTRAINT "ville_jointure_ecole_ecole_id_fkey" FOREIGN KEY ("ecole_id") REFERENCES "ecoles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "filiere" ADD CONSTRAINT "filiere_ecole_id_fkey" FOREIGN KEY ("ecole_id") REFERENCES "ecoles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_utilisateur_id_fkey" FOREIGN KEY ("utilisateur_id") REFERENCES "utilisateurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_city_school_id_fkey" FOREIGN KEY ("city_school_id") REFERENCES "ville_jointure_ecole"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_filiere_id_fkey" FOREIGN KEY ("filiere_id") REFERENCES "filiere"("id") ON DELETE SET NULL ON UPDATE CASCADE;
