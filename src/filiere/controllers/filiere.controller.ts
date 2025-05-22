import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FiliereService } from '../services/filiere.service';
import { CreateFiliereDto } from '../dto/create-filiere.dto';
import { UpdateFiliereDto } from '../dto/update-filiere.dto';

@Controller('filiere')
export class FiliereController {
  constructor(private readonly filiereService: FiliereService) {}

  @Post()
  async create(@Body() createFiliereDto: CreateFiliereDto) {
    return await this.filiereService.create(createFiliereDto);
  }

  @Get()
  async findAll() {
    return await this.filiereService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return {
      statusCode: HttpStatus.OK,
      data: await this.filiereService.findOne(id),
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateFiliereDto: UpdateFiliereDto,
  ) {
    return await this.filiereService.update(id, updateFiliereDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.filiereService.remove(id);
  }
}
