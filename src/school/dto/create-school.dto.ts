import { BacOption, SchoolType } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { FiliereEntity } from 'src/filiere/entities/filiere.entity';

export class CreateSchoolDto {
  @IsString()
  @IsNotEmpty({ message: 'School name is required' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toUpperCase() : value,
  )
  name: string;

  @IsArray()
  @IsNotEmpty({ message: 'At least one BAC option is required' })
  bacOptionsAllowed: BacOption[];

  @IsEnum(SchoolType)
  type: SchoolType;

  @IsBoolean()
  isOpen: boolean;
}
