import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateSchoolTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsInt()
  @IsOptional()
  @Min(1)
  maxCities?: number;

  @IsBoolean()
  @IsOptional()
  requiresCityRanking?: boolean;

  @IsInt()
  @IsOptional()
  @Min(1)
  maxFilieres?: number;

  @IsBoolean()
  @IsOptional()
  allowMultipleFilieresSelection?: boolean;
} 