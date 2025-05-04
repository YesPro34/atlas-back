import { userRole, UserStatus, BacOption } from '@prisma/client';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  massarCode: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEnum(userRole)
  role: userRole;

  @IsEnum(UserStatus)
  status: UserStatus;

  @IsOptional()
  @IsEnum(BacOption)
  bacOption?: BacOption;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(20)
  nationalMark?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(20)
  generalMark?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(20)
  mathMark?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(20)
  physicMark?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(20)
  svtMark?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(20)
  englishMark?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(20)
  philosophyMark?: number;
}
