import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateSchoolDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  typeId: string;

  @IsBoolean()
  @IsOptional()
  isOpen?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  cityIds?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  bacOptionIds?: string[];

  @IsString()
  @IsOptional()
  image?: string;
}
