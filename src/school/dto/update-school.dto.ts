import { SchoolType } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateSchoolDto {
  @IsString()
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toUpperCase() : value,
  )
  name?: string;

  @IsEnum(SchoolType)
  @IsOptional()
  type?: SchoolType;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  bacOptionsAllowed?: string[];

  @IsBoolean()
  @IsOptional()
  isOpen?: boolean;
}
