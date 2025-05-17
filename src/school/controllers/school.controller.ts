import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { SchoolService } from '../services/school.service';
import { CreateSchoolDto } from '../dto/create-school.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { File } from 'multer';
import * as XLSX from 'xlsx';
import { diskStorage } from 'multer';
import { BacOption, SchoolType } from '@prisma/client';
import { UpdateSchoolDto } from '../dto/update-school.dto';
// import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
interface ExcelRow {
  name: string;
  type: SchoolType;
  bacOptionsAllowed: BacOption[];
  isOpen: boolean;
}
// @UseGuards(JwtAuthGuard)
@Controller('school')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Post()
  async create(@Body() dto: CreateSchoolDto) {
    return await this.schoolService.create(dto);
  }

  @Get()
  async findAll() {
    return await this.schoolService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const school = await this.schoolService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      data: school,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateSchoolDto) {
    return await this.schoolService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.schoolService.remove(id);
  }

  @Post('import')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_, file, cb) => {
          cb(null, `${Date.now()}-${file.originalname}`);
        },
      }),
    }),
  )
  async uploadSchoolsFromExcel(@UploadedFile() file: File.Multer.File) {
    const workbook = XLSX.readFile(file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);
    const results: { school: string; status: string; reason?: string }[] = [];
    for (const row of rows as ExcelRow[]) {
      const rawOptions = Array.isArray(row.bacOptionsAllowed)
        ? row.bacOptionsAllowed
        : String(row.bacOptionsAllowed || '')
            .split(',')
            .map((opt) => opt.trim().toUpperCase());

      const validBacOptions = rawOptions.filter((opt) =>
        Object.values(BacOption).includes(opt as BacOption),
      );

      const createSchoolDto: CreateSchoolDto = {
        name: String(row.name).trim().toUpperCase(),
        type: row.type,
        bacOptionsAllowed: validBacOptions as BacOption[],
        isOpen: Boolean(row.isOpen),
      };
      try {
        await this.schoolService.create(createSchoolDto);
        results.push({
          school: createSchoolDto.name,
          status: 'Created',
        });
      } catch (error) {
        results.push({
          school: createSchoolDto.name,
          status: 'Error',
          reason: error?.response?.message || error.message,
        });
      }
    }

    return { summary: results };
  }
}
