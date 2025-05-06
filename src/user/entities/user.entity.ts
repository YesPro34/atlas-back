import {
  UserStatus,
  userRole,
  BacOption,
  Session,
  Application,
} from '@prisma/client';

export class UserEntity {
  id: string;
  massarCode: string;
  password: string;
  role: userRole;
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
  sessions?: Session[];
  applications?: Application[];

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
