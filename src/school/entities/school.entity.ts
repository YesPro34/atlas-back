import { BacOption } from '@prisma/client';

export class School {
  id: string;
  name: string;
  filieres: string[];
  bacOptionsAllowed: BacOption[];
  isOpen: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
