import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBacOptionDto {
  @IsString()
  @IsNotEmpty()
  name: string;
} 