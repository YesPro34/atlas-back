import { BacOption } from '@prisma/client';
import { IsArray, IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateSchoolDto {
  @IsString()
  @IsNotEmpty({ message: 'School name is required' })
  name: string;

  @IsArray()
  @IsNotEmpty({ message: 'At least one filière is required' })
  filieres: string[];

  @IsArray()
  @IsNotEmpty({ message: 'At least one BAC option is required' })
  bacOptionsAllowed: BacOption[];

  @IsBoolean()
  isOpen: boolean;
}

export class UpdateSchoolDto extends CreateSchoolDto {}
