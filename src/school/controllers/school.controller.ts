import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
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
import * as XLSX from 'xlsx';
import { diskStorage } from 'multer';
import { SchoolType } from '@prisma/client';
import { UpdateSchoolDto } from '../dto/update-school.dto';
// import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
// Define the expected Excel row structure
interface ExcelRow {
  name: string;
  type: SchoolType;
  isOpen: boolean;
  bacOptionsAllowed: string | string[];
  cities: string | string[];
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
    // Read the Excel file
    const workbook = XLSX.readFile(file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    console.log('Rows:', rows);

    // const results: { school: string; status: string; reason?: string }[] = [];

    // // Process each row in the Excel file
    // for (const row of rows as ExcelRow[]) {
    //   // try {
    //   // Parse bac options from the Excel
    //   const rawBacOptions = Array.isArray(row.bacOptionsAllowed)
    //     ? row.bacOptionsAllowed
    //     : String(row.bacOptionsAllowed || '')
    //         .split(',')
    //         .map((opt) => opt.trim());

    //   // Parse cities from the Excel
    //   const rawCities = Array.isArray(row.cities)
    //     ? row.cities
    //     : String(row.cities || '')
    //         .split(',')
    //         .map((city) => city.trim());

      // Create the school with related data
      //     const createdSchool = await this.schoolService.createWithRelations({
      //       schoolData: {
      //         name: String(row.name).trim().toUpperCase(),
      //         type: row.type,
      //         isOpen: Boolean(row.isOpen),
      //       },
      //       bacOptionNames: rawBacOptions,
      //       cityNames: rawCities,
      //     });

      //     results.push({
      //       school: createdSchool.name,
      //       status: 'Created',
      //     });
      //   } catch (error) {
      //     results.push({
      //       school: String(row.name),
      //       status: 'Error',
      //       reason: error?.response?.message || error.message,
      //     });
      //   }
      // }

      // return { summary: results };
    //}
  }
}
