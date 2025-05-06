// src/user/dto/upload-file.dto.ts
import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class UploadFileDto {
  @IsNotEmpty()
  @Type(() => Buffer)
  file: any;
}
