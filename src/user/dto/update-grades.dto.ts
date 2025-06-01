import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class UpdateGradesDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(20)
  nationalMark?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(20)
  generalMark?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(20)
  mathMark?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(20)
  physicMark?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(20)
  svtMark?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(20)
  englishMark?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(20)
  philosophyMark?: number;
} 