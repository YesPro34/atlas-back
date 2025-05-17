import { IsOptional, IsString } from 'class-validator';

export class UpdateCityDto {
  @IsString()
  @IsOptional()
  name?: string;
}
