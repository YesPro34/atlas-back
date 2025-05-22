// src/application/dto/create-application.dto.ts
import {
  IsString,
  IsArray,
  IsInt,
  IsOptional,
  Min,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ChoiceType } from '@prisma/client';

export class ApplicationChoiceDto {
  @IsInt()
  @Min(1)
  rank: number;

  @IsOptional()
  @IsString()
  cityId?: string;

  @IsOptional()
  @IsString()
  filiereId?: string;

  @IsEnum(ChoiceType)
  type: ChoiceType;
}

export class CreateApplicationDto {
  @IsString()
  schoolId: string;

  @IsString()
  userId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ApplicationChoiceDto)
  choices: ApplicationChoiceDto[];
}

export class UpdateApplicationStatusDto {
  @IsEnum(['PENDING', 'REGISTERED'])
  status: 'PENDING' | 'REGISTERED';
}
