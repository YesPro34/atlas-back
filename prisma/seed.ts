import * as bcrypt from 'bcrypt';
import { BacOption, PrismaClient, Role, UserStatus } from '@prisma/client';

const prisma = new PrismaClient();

const DEFAULT_ADMIN = {
    password: process.env.ADMIN_PASSWORD as string,
    massarCode: process.env.ADMIN_MASSAR_CODE as string,
    firstName: "super",
    lastName: "admin",
    role: "ADMIN" as Role,
    status: "ACTIVE" as UserStatus,
    bacOption: "PC" as BacOption,
    city: "Agadir",
    nationalMark: 0,
    generalMark: 0,
    mathMark: 0,
    physicMark: 0,
    svtMark: 0,
    englishMark: 0,
    philosophyMark: 0
};

// Cities seeding
const cities = [
  "Casablanca", "Rabat", "Fès", "Marrakech", "Agadir", "Tanger", "Oujda",
  "Meknès", "Tétouan", "El Jadida", "Nador", "Kenitra", "Béni Mellal",
  "Khouribga", "Settat", "Safi", "Taza", "Mohammedia", "Errachidia", "Laâyoune",
  "Guelmim", "Ouarzazate", "Taroudant", "Azrou", "Larache", "Al Hoceïma",
  "Ksar El Kebir", "Berkane", "Taourirt", "Midelt", "Ifrane", "Oued Zem",
  "Tan-Tan", "Fquih Ben Salah", "Temara", "Tiflet", "Salé", "Sidi Kacem",
  "Sidi Slimane", "Zagora", "Essaouira", "Tinghir", "Youssoufia", "Jerada",
  "Dakhla", "Boujdour", "Sidi Bennour", "Benslimane", "Aït Melloul", "Skhirat"
];


async function main() {
  const existingSuperAdmin = await prisma.user.findUnique({
    where: {
      massarCode: DEFAULT_ADMIN.massarCode,
    },
  });

  if (!existingSuperAdmin && DEFAULT_ADMIN.massarCode && DEFAULT_ADMIN.password) {
    const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, 10)

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

      // create cities
    for (const cityName of cities) {
      const existingCity = await prisma.city.findFirst({ where: { name: cityName } });
    
      if (!existingCity) {
        await prisma.city.create({ data: { name: cityName } });
        console.log(`Ville ajoutée : ${cityName}`);
      } else {
        console.log(`Ville déjà existante : ${cityName}`);
      }
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
