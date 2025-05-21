import { SchoolType } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateSchoolDto {
  @IsString()
  @IsNotEmpty({ message: 'School name is required' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toUpperCase() : value,
  )
  name: string;

  @IsEnum(SchoolType)
  type: SchoolType;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ message: 'At least one BAC option is required' })
  bacOptionsAllowed: string[];

  @IsBoolean()
  isOpen: boolean;
}
