import { BacOption, SchoolType } from '@prisma/client';
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
  name: string;

  @IsEnum(BacOption, { each: true })
  @IsArray()
  @IsOptional()
  bacOptionsAllowed: BacOption[];

  @IsEnum(SchoolType)
  @IsOptional()
  type: SchoolType;

  @IsBoolean()
  @IsOptional()
  isOpen: boolean;
}
