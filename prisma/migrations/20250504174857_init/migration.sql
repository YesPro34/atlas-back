-- CreateEnum
CREATE TYPE "userRole" AS ENUM ('STUDENT', 'ADMIN');

-- CreateEnum
CREATE TYPE "BacOption" AS ENUM ('null', 'PC', 'SVT', 'SMA', 'ECO', 'SMB', 'STE', 'STM', 'SGC');

-- CreateEnum
CREATE TYPE "TokenStatus" AS ENUM ('PENDING', 'DONE');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'REGISTERED');

-- CreateTable
CREATE TABLE "utilisateurs" (
    "id" TEXT NOT NULL,
    "massar_code" TEXT NOT NULL,
    "mot_de_passe" TEXT NOT NULL,
    "role" "userRole" NOT NULL,
    "etat" "UserStatus" NOT NULL DEFAULT 'INACTIVE',
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "option_bac" "BacOption" NOT NULL,
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
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_expiration" TIMESTAMP(3) NOT NULL,
    "date_modification" TIMESTAMP(3) NOT NULL,
    "utilisateur_id" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "token_verification" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_expiration" TIMESTAMP(3),
    "etat" "TokenStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "token_verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ecoles" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "filieres" TEXT[],
    "option_bac_autorise" "BacOption"[],
    "est_ouverte" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ecoles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applications" (
    "id" TEXT NOT NULL,
    "utilisateur_id" TEXT NOT NULL,
    "ecole_id" TEXT NOT NULL,
    "filieres_choisi" TEXT,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "utilisateurs_massar_code_key" ON "utilisateurs"("massar_code");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "applications_utilisateur_id_ecole_id_key" ON "applications"("utilisateur_id", "ecole_id");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_utilisateur_id_fkey" FOREIGN KEY ("utilisateur_id") REFERENCES "utilisateurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_utilisateur_id_fkey" FOREIGN KEY ("utilisateur_id") REFERENCES "utilisateurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_ecole_id_fkey" FOREIGN KEY ("ecole_id") REFERENCES "ecoles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
