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
  bacOption: BacOption;
  city?: string | null;
  nationalMark?: number | null;
  generalMark?: number | null;
  mathMark?: number | null;
  physicMark?: number | null;
  svtMark?: number | null;
  englishMark?: number | null;
  philosophyMark?: number | null;
  sessions?: Session[] | null;
  applications?: Application[]| null;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
