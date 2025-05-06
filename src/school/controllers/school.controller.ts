import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { SchoolService } from '../services/school.service';
import { CreateSchoolDto, UpdateSchoolDto } from '../dto/create-school.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';


@UseGuards(JwtAuthGuard)
@Controller('school')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Post()
  async create(@Body() dto: CreateSchoolDto) {
    const school = await this.schoolService.create(dto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'School created successfully',
      data: school,
    };
  }

  @Get()
  async findAll() {
    const schools = await this.schoolService.findAll();
    return {
      statusCode: HttpStatus.OK,
      data: schools,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const school = await this.schoolService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      data: school,
    };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateSchoolDto) {
    const updated = await this.schoolService.update(id, dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'School updated successfully',
      data: updated,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.schoolService.remove(id);
  }
}
