// src/application/dto/create-application.dto.ts
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class CitySchoolChoiceDto {
  @IsUUID()
  @IsNotEmpty()
  villeEcoleId: string;

  @IsNumber()
  @IsNotEmpty()
  rank: number;
}

export class FiliereChoiceDto {
  @IsUUID()
  @IsNotEmpty()
  filiereId: string;

  @IsNumber()
  @IsNotEmpty()
  rank: number;
}

export class CreateApplicationDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  schoolId: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CitySchoolChoiceDto)
  citySchoolChoices?: CitySchoolChoiceDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FiliereChoiceDto)
  filiereChoices?: FiliereChoiceDto[];
}

export class UpdateApplicationStatusDto {
  @IsString()
  @IsNotEmpty()
  status: 'PENDING' | 'REGISTERED';
}
