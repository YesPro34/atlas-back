// src/users/dto/login.dto.ts
import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  massarCode: string;

  @IsString()
  password: string;
}
