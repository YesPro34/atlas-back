import { PartialType } from '@nestjs/mapped-types';
import { CreateBacOptionDto } from './create-bac-option.dto';

export class UpdateBacOptionDto extends PartialType(CreateBacOptionDto) {}
