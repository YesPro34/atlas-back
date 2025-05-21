import { SchoolType } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { BacOptionEntity } from 'src/bac-option/bacOption.entity';

export class UpdateSchoolDto {
  @IsString()
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toUpperCase() : value,
  )
  name: string;

  @IsEnum(BacOptionEntity, { each: true })
  @IsArray()
  @IsOptional()
  bacOptionsAllowed: BacOptionEntity[];

  @IsEnum(SchoolType)
  @IsOptional()
  type: SchoolType;

  @IsBoolean()
  @IsOptional()
  isOpen: boolean;
}
