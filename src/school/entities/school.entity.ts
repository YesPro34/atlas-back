import { SchoolType } from '@prisma/client';

export class School {
  id: string;
  name: string;
  type: SchoolType;
  isOpen: boolean;
  bacOptionsAllowed: { id: string; name: string }[];
  cities: { id: string; name: string }[];
  createdAt?: Date;
  updatedAt?: Date;

  constructor(partial: Partial<School>) {
    Object.assign(this, partial);
  }
}
