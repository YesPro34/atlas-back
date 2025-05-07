import { BacOption, SchoolType } from '@prisma/client';
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
  name: string;

  @IsArray()
  @IsNotEmpty({ message: 'At least one BAC option is required' })
  bacOptionsAllowed: BacOption[];

  @IsEnum(SchoolType)
  type: SchoolType;

  @IsBoolean()
  isOpen: boolean;
}

export class UpdateSchoolDto extends CreateSchoolDto {}
