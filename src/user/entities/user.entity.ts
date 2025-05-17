import { UserStatus, Role, BacOption, Application } from '@prisma/client';

export class UserEntity {
  id: string;
  massarCode: string;
  password: string;
  role: Role;
  status: UserStatus;
  firstName: string;
  lastName: string;
  bacOption?: BacOption;
  city?: string;
  nationalMark?: number;
  generalMark?: number;
  mathMark?: number;
  physicMark?: number;
  svtMark?: number;
  englishMark?: number;
  philosophyMark?: number;
  applications?: Application[];

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
