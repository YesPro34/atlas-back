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
import { SchoolTypeService } from '../services/school-type.service';
import { CreateSchoolTypeDto } from '../dto/create-school-type.dto';
import { UpdateSchoolTypeDto } from '../dto/update-school-type.dto';

@Controller('school-type')
export class SchoolTypeController {
  constructor(private readonly schoolTypeService: SchoolTypeService) {}

  @Post()
  async create(@Body() createSchoolTypeDto: CreateSchoolTypeDto) {
    return await this.schoolTypeService.create(createSchoolTypeDto);
  }

  @Get()
  async findAll() {
    return await this.schoolTypeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return {
      statusCode: HttpStatus.OK,
      data: await this.schoolTypeService.findOne(id),
    };
  }

  @Get('code/:code')
  async findByCode(@Param('code') code: string) {
    return {
      statusCode: HttpStatus.OK,
      data: await this.schoolTypeService.findByCode(code),
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSchoolTypeDto: UpdateSchoolTypeDto,
  ) {
    return await this.schoolTypeService.update(id, updateSchoolTypeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.schoolTypeService.remove(id);
  }
} 