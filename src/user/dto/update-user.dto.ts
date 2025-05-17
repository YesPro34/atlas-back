import { Role, UserStatus, BacOption } from '@prisma/client';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsUUID,
} from 'class-validator';

export class UpdateUserDto {
  @IsUUID()
  @IsOptional()
  id: string;

  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsString()
  @IsOptional()
  massarCode: string;

  @IsOptional()
  @IsEnum(Role, { message: 'Invalid user role' })
  role: Role;

  @IsOptional()
  @IsEnum(UserStatus, { message: 'Invalid user status' })
  status: UserStatus;

  @IsOptional()
  @IsEnum(BacOption, { message: 'Invalid BAC option' })
  bacOption: BacOption;

  @IsOptional()
  @IsString()
  city: string;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'National mark must be at least 0' })
  @Max(20, { message: 'National mark must not exceed 20' })
  nationalMark: number;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'General mark must be at least 0' })
  @Max(20, { message: 'General mark must not exceed 20' })
  generalMark: number;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Math mark must be at least 0' })
  @Max(20, { message: 'Math mark must not exceed 20' })
  mathMark: number;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Physics mark must be at least 0' })
  @Max(20, { message: 'Physics mark must not exceed 20' })
  physicMark: number;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'SVT mark must be at least 0' })
  @Max(20, { message: 'SVT mark must not exceed 20' })
  svtMark: number;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'English mark must be at least 0' })
  @Max(20, { message: 'English mark must not exceed 20' })
  englishMark: number;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Philosophy mark must be at least 0' })
  @Max(20, { message: 'Philosophy mark must not exceed 20' })
  philosophyMark: number;
}
