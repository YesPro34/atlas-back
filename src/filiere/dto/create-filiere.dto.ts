import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateFiliereDto {
  @IsString()
  @IsNotEmpty({ message: 'Filière name is required' })
  name: string;

  @IsNotEmpty({ message: 'Filière schoolId is required' })
  @IsUUID()
  schoolId: string;
} 