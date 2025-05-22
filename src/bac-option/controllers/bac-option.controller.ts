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
import { BacOptionService } from '../services/bac-option.service';
import { CreateBacOptionDto } from '../dto/create-bac-option.dto';
import { UpdateBacOptionDto } from '../dto/update-bac-option.dto';

@Controller('bac-option')
export class BacOptionController {
  constructor(private readonly bacOptionService: BacOptionService) {}

  @Post()
  async create(@Body() createBacOptionDto: CreateBacOptionDto) {
    return await this.bacOptionService.create(createBacOptionDto);
  }

  @Get()
  async findAll() {
    return await this.bacOptionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return {
      statusCode: HttpStatus.OK,
      data: await this.bacOptionService.findOne(id),
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBacOptionDto: UpdateBacOptionDto,
  ) {
    return await this.bacOptionService.update(id, updateBacOptionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.bacOptionService.remove(id);
  }
}
