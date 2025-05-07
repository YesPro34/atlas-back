import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { CreateFiliereDto } from '../dto/create-filiere.dto';
import { UpdateFiliereDto } from '../dto/update-filiere.dto';
import { FiliereService } from '../services/filiere.service';

@Controller('filiere')
export class FiliereController {
  constructor(private readonly filiereService: FiliereService) {}

  @Post()
  create(@Body() dto: CreateFiliereDto) {
    return this.filiereService.create(dto);
  }

  @Get()
  findAll() {
    return this.filiereService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filiereService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateFiliereDto) {
    return this.filiereService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filiereService.remove(id);
  }
}
