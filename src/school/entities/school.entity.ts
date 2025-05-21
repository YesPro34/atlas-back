import { SchoolType } from '@prisma/client';
import { BacOptionEntity } from 'src/bac-option/bacOption.entity';
import { CityEntity } from 'src/city/entities/city.entity';
import { FiliereEntity } from 'src/filiere/entities/filiere.entity';

export class School {
  id: string;
  name: string;
  type: SchoolType;
  isOpen: boolean;

  // Relations
  filieres: FiliereEntity[];
  bacOptionsAllowed: BacOptionEntity[];
  cities: CityEntity[];

  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;

  constructor(partial: Partial<School>) {
    Object.assign(this, partial);
  }
}
