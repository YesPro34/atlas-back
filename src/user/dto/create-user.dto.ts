import { Role, UserStatus, BacOption } from '@prisma/client';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsUUID,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Massar code is required' })
  massarCode: string;

  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @IsNotEmpty({ message: 'User role is required' })
  @IsEnum(Role, { message: 'Invalid user role' })
  role: Role;

  @IsNotEmpty({ message: 'User status is required' })
  @IsEnum(UserStatus, { message: 'Invalid user status' })
  status: UserStatus;

  @IsOptional()
  @IsUUID()
  bacOptionId?: string;

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
