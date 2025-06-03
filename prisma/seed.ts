import * as bcrypt from 'bcrypt';
import {PrismaClient, Role, UserStatus } from '@prisma/client';

const prisma = new PrismaClient();

// School types seeding
const schoolTypes = [
  {
    name: "École Nationale des Sciences Appliquées",
    code: "ENSA",
    maxCities: 13,
    requiresCityRanking: true,
    maxFilieres: null,
    allowMultipleFilieresSelection: false
  },
  {
    name: "École Nationale Supérieure d'Arts et Métiers",
    code: "ENSAM",
    maxCities: 3,
    requiresCityRanking: true,
    maxFilieres: null,
    allowMultipleFilieresSelection: false
  },
  {
    name: "École Nationale de Commerce et de Gestion",
    code: "ENCG",
    maxCities: 12,
    requiresCityRanking: true,
    maxFilieres: null,
    allowMultipleFilieresSelection: false
  },
  {
    name: "Classes Préparatoires aux Grandes Écoles",
    code: "CPGE",
    maxCities: null,
    requiresCityRanking: false,
    maxFilieres: 8,
    allowMultipleFilieresSelection: true
  },
  {
    name: "Institut Spécialisé dans les Métiers de l'Aéronautique et de la Logistique Aéroportuaire",
    code: "ISMALA",
    maxCities: null,
    requiresCityRanking: false,
    maxFilieres: 3,
    allowMultipleFilieresSelection: true,
  },
  {
    name: "Institut des Métiers de Sport",
    code: "IMS",
    maxCities: null,
    requiresCityRanking: false,
    maxFilieres: 2,
    allowMultipleFilieresSelection: true,
  },
  {
    name: "Institut de Formation aux Métiers du Bâtiment et des Travaux Publics",
    code: "IFMBTP",
    maxCities: null,
    requiresCityRanking: false,
    maxFilieres: 3,
    allowMultipleFilieresSelection: true,
  },
  {
    name: "Faculté de Médecine et de Pharmacie et de Dentaire",
    code: "FMPD",
    maxCities: null,
    requiresCityRanking: false,
    maxFilieres: 3,
    allowMultipleFilieresSelection: true,
  },
  {
    name: "Instituts Supérieurs des Professions Infirmières et Techniques de Santé",
    code: "ISPITS",
    maxCities: null,
    requiresCityRanking: false,
    maxFilieres: 25,
    allowMultipleFilieresSelection: true
  },
  {
    name: "Institut Supérieur des Pêches Maritimes",
    code: "ISPM",
    maxCities: null,
    requiresCityRanking: false,
    maxFilieres: 3,
    allowMultipleFilieresSelection: true
  },
  {
    name: "Institut Supérieur des Sciences de la Santé",
    code: "ISSS",
    maxCities: null,
    requiresCityRanking: false,
    maxFilieres: 7,
    allowMultipleFilieresSelection: true
  },
  {
    name: "École Nationale d'Architecture",
    code: "ENA",
    maxCities: 6,
    requiresCityRanking: true,
    maxFilieres: null,
    allowMultipleFilieresSelection: false
  },
  {
    name: "Institut des Mines Marrakech",
    code: "IMM",
    maxCities: null,
    requiresCityRanking: false,
    maxFilieres: 4,
    allowMultipleFilieresSelection: true
  },
  {
    name: "Institut de Formation des Techniciens Spécialisés en Architecture et en Urbanisme",
    code: "IFTSAU",
    maxCities: null,
    requiresCityRanking: false,
    maxFilieres: 4,
    allowMultipleFilieresSelection: true
  },
  {
    name: "Institut Mines Touissit",
    code: "IMT",
    maxCities: null,
    requiresCityRanking: false,
    maxFilieres: 2,
    allowMultipleFilieresSelection: true
  },
  {
    name: "Institut de Formation aux Métiers de l'Industrie Automobile de Casablanca",
    code: "IFMIAC",
    maxCities: null,
    requiresCityRanking: false,
    maxFilieres: 3,
    allowMultipleFilieresSelection: false,
  },
  {
    name: "Institut de Formation aux Métiers de l'Industrie Automobile de Kénitra",
    code: "IFMIAK",
    maxCities: null,
    requiresCityRanking: false,
    maxFilieres: 3,
    allowMultipleFilieresSelection: false,
  },
  {
    name: "Institut de Formation aux Métiers de l'Industrie Automobile de Tanger",
    code: "IFMIAT",
    maxCities: null,
    requiresCityRanking: false,
    maxFilieres: 3,
    allowMultipleFilieresSelection: false,
  },
  {
    name: "Institut de Formation aux Métiers de la Santé et de l'Action Sociale de Beni Mellal",
    code: "IFMSASB",
    maxCities: null,
    requiresCityRanking: false,
    maxFilieres: 3,
    allowMultipleFilieresSelection: false,
  },
  {
    name: "Institut de Formation aux Métiers de la Santé et de l'Action Sociale de Oujda",
    code: "IFMSASO",
    maxCities: null,
    requiresCityRanking: false,
    maxFilieres: 3,
    allowMultipleFilieresSelection: false,
  },
  {
    name: "Institut de Formation aux Métiers de la Santé et de l'Action Sociale de Meknès",
    code: "IFMSASM",
    maxCities: null,
    requiresCityRanking: false,
    maxFilieres: 3,
    allowMultipleFilieresSelection: false,
  },
];

// Cities seeding
const cities = [
  // Unique cities from the original list
  "Casablanca", "Rabat", "Fès", "Marrakech", "Agadir", "Tanger", "Oujda",
  "Meknès", "Tétouan", "El Jadida", "Nador", "Kenitra", "Béni Mellal",
  "Khouribga", "Settat", "Safi", "Taza", "Mohammedia", "Errachidia", "Laâyoune",
  "Guelmim", "Ouarzazate", "Taroudant", "Azrou", "Larache", "El Houciema",
  "Ksar El Kebir", "Berkane", "Taourirt", "Midelt", "Ifrane", "Oued Zem",
  "Tan-Tan", "Fquih Ben Salah", "Temara", "Tiflet", "Salé", "Sidi Kacem",
  "Sidi Slimane", "Zagora", "Essaouira", "Tinghir", "Youssoufia", "Jerada",
  "Dakhla", "Boujdour", "Sidi Bennour", "Benslimane", "Aït Melloul", "Skhirat",
  "Berchid", "Nouaceur", "Khemisset", "Khenifra", "Beni Ansar", "Tiznit",
  "Sefrou", "Sidi Ifni", "Moulay Yacoub", "Sidi Rahal", "Ait Ourir", "Bouskoura",
  "Moulay Idriss", "Tafraout", "Sidi Ali", "Ait Baha", "Ait Ishaq", "Ait Hamou",
  "Ait Bouguemez", "Ait Bouadou", "Ait Boufrah", "Ait Bouhya",
  "Chefchaouen", "Martil", "Fnideq", "Guercif", "Souk El Arbaa","Sidi Yahya El Gharb",
  "Sidi Taibi", "Sidi Harazem", "Sidi Allal Tazi", "Sidi Bettache",
  "Sidi El Mokhtar", "Sidi Hajjaj", "Sidi Slimane", "Echcharraa",
  "Sidi Yahya Zaer", "Akhfenir", "Bouarfa", "Boulemane", "Demnate", "El Hajeb",
  "Figuig", "Imzouren", "Jorf El Melha", "Kalaat Mgouna",
  "Kelaat Sraghna", "Oulad Teima", "Oulad Tayeb", "Ouazzane",
  "Smara", "Souk Sebt Oulad Nemma", "Tahla", "Taliouine", "Tamesna", "Tarfaya",
  "Tata", "Taounate", "Tichka", "Zemmour", "Zerkten"
];

// BacOptions seeding
const bacOptions = ["PC", "SVT", "SMA", "SMB", "STE", "STM", "ECO", "SGC"];  

async function main() {
  // Seed school types
  for (const schoolType of schoolTypes) {
    const existingSchoolType = await prisma.schoolType.findUnique({
      where: { code: schoolType.code }
    });

    if (!existingSchoolType) {
      await prisma.schoolType.create({
        data: schoolType
      });
      console.log(`School type created: ${schoolType.name} (${schoolType.code})`);
    } else {
      console.log(`School type already exists: ${schoolType.name} (${schoolType.code})`);
    }
  }

  // create BacOptions in the database
  for (const option of bacOptions) {
    const existingOption = await prisma.bacOption.findUnique({ where: { name: option } });
    if (!existingOption) {
      await prisma.bacOption.create({
        data: { name: option },
      });
      console.log(`BacOption créé : ${option}`);
    } else {
      console.log(`BacOption déjà existant : ${option}`);
    }
  }

  const bacOption = await prisma.bacOption.findFirst({where : { name: "PC" }});

  const DEFAULT_ADMIN = {
    password: process.env.ADMIN_PASSWORD as string,
    massarCode: process.env.ADMIN_MASSAR_CODE as string,
    firstName: "super",
    lastName: "admin",
    role: "ADMIN" as Role,
    status: "ACTIVE" as UserStatus,
    bacOptionId: bacOption?.id,
    city: "Agadir",
    nationalMark: 0,
    generalMark: 0,
    mathMark: 0,
    physicMark: 0,
    svtMark: 0,
    englishMark: 0,
    philosophyMark: 0
  };

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
  } else {
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
