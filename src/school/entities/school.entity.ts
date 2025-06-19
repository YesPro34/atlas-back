import { School as PrismaSchool } from '@prisma/client';

export class School {
  id: string;
  name: string;
  typeId: string;
  isOpen: boolean;
  bacOptionsAllowed: { id: string; name: string }[];
  cities: { id: string; name: string }[];
  image?: string | null;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(partial: Partial<School>) {
    Object.assign(this, partial);
  }
}
