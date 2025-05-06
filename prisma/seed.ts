import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DEFAULT_ADMIN = {
    password: process.env.ADMIN_PASSWORD as string,
    massarCode: process.env.ADMIN_MASSAR_CODE as string,
    firstName: "super",
    lastName: "admin",
    role: "ADMIN",
    status: "ACTIVE",
    bacOption: "PC",
    city: "Agadir",
    nationalMark: 0,
    generalMark: 0,
    mathMark: 0,
    physicMark: 0,
    svtMark: 0,
    englishMark: 0,
    philosophyMark: 0
} as const;

async function main() {
  const existingSuperAdmin = await prisma.user.findUnique({
    where: {
      massarCode: DEFAULT_ADMIN.massarCode,
    },
  });

  if (!existingSuperAdmin && DEFAULT_ADMIN.massarCode && DEFAULT_ADMIN.password) {
    const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, 10);

    // Utilisation d'une transaction pour des opérations atomiques

      await prisma.user.create({
        data: {
          ...DEFAULT_ADMIN,
          password: hashedPassword,
        },
      });

      console.log('Superadmin créé avec succe ');
    }else {
    console.log('Le superadmin existe déjà');
  }

}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
