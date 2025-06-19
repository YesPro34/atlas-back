import { PartialType } from '@nestjs/mapped-types';
import { CreateSchoolDto } from './create-school.dto';
import { IsString, IsOptional } from 'class-validator';

export class UpdateSchoolDto extends PartialType(CreateSchoolDto) {
  @IsString()
  @IsOptional()
  image?: string;
}
