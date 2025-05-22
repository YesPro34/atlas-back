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
  Etablissement: string;
  Type: string;
  Filieres?: string;
  bacOptionsAllowed: string;
  isOpen: string;
  Villes?: string;
}

interface SchoolNetwork {
  name: string;
  maxCities?: number;
  requiresCityRanking: boolean;
  maxFilieres?: number;
  allowMultipleFilieresSelection?: boolean;
  specificBacOptions?: string[];
  type: SchoolType;
}

// Add this interface at the top with other interfaces
interface FiliereWithBacOptions {
  name: string;
  bacOptions: string[];
}

interface ProcessedSchoolData {
  name: string;
  type: SchoolType;
  isOpen: boolean;
  cities: string[];
  filieresWithBacOptions: FiliereWithBacOptions[];
  defaultBacOptions: string[];
}

const SCHOOL_NETWORKS: { [key: string]: SchoolNetwork } = {
  ENSA: {
    name: 'ENSA',
    maxCities: 13,
    requiresCityRanking: true,
    type: SchoolType.ENSA,
  },
  ENSAM: {
    name: 'ENSAM',
    maxCities: 3,
    requiresCityRanking: true,
    type: SchoolType.ENSAM,
  },
  ENCG: {
    name: 'ENCG',
    maxCities: 12,
    requiresCityRanking: true,
    type: SchoolType.ENCG,
  },
  ISMALA: {
    name: 'ISMALA',
    maxFilieres: 3,
    requiresCityRanking: false,
    allowMultipleFilieresSelection: false,
    type: SchoolType.ISMALA,
  },
  FMPD: {
    name: 'FMPD',
    maxFilieres: 3,
    requiresCityRanking: false,
    allowMultipleFilieresSelection: false,
    type: SchoolType.FMPD,
  },
  IMS: {
    name: 'IMS',
    maxFilieres: 2,
    requiresCityRanking: false,
    allowMultipleFilieresSelection: false,
    type: SchoolType.IMS,
  },
  IFMBTP: {
    name: 'IFMBTP',
    maxFilieres: 3,
    requiresCityRanking: false,
    allowMultipleFilieresSelection: true,
    type: SchoolType.IFMBTP,
  },
  CPGE: {
    name: 'CPGE',
    requiresCityRanking: false,
    specificBacOptions: ['PC', 'SVT', 'SMA', 'SMB'],
    type: SchoolType.CPGE,
  },
};

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
  async uploadSchoolsFromExcel(@UploadedFile() file: any) {
    // Read the Excel file
    const workbook = XLSX.readFile(file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    const results: { school: string; status: string; reason?: string }[] = [];
    const schoolsMap = new Map<string, ProcessedSchoolData>();
    let currentSchool: string | null = null;

    // First pass: Group rows by school and collect all data
    for (const row of rows) {
      // If this row has an Etablissement, it's a new school
      if (row.Etablissement) {
        currentSchool = row.Etablissement.trim().toUpperCase();

        if (!schoolsMap.has(currentSchool)) {
          const bacOptions = row.bacOptionsAllowed
            ? row.bacOptionsAllowed
                .split(',')
                .map((opt) => opt.trim())
                .filter(Boolean)
            : [];

          // Initialize school data on first encounter
          schoolsMap.set(currentSchool, {
            name: currentSchool,
            type: row.Type?.trim().toUpperCase() as SchoolType,
            isOpen: row.isOpen?.trim().toUpperCase() === 'TRUE',
            cities: row.Villes
              ? row.Villes.split(',')
                  .map((city) => city.trim())
                  .filter(Boolean)
              : [],
            filieresWithBacOptions: [],
            defaultBacOptions: bacOptions, // Store default bacOptions for schools without filières
          });
        }
      }

      // Skip if we don't have a current school (shouldn't happen with well-formed data)
      if (!currentSchool) continue;

      // Process filières and their bac options for this row
      if (row.Filieres) {
        const filieres = row.Filieres.split(',')
          .map((f) => f.trim())
          .filter(Boolean);

        const bacOptions = row.bacOptionsAllowed
          ? row.bacOptionsAllowed
              .split(',')
              .map((opt) => opt.trim())
              .filter(Boolean)
          : [];

        // Get the current school's data
        const schoolData = schoolsMap.get(currentSchool)!;

        // Add each filière with its specific bac options
        filieres.forEach((filiere) => {
          // Directly add the filière without checking for duplicates
          schoolData.filieresWithBacOptions.push({
            name: filiere,
            bacOptions: bacOptions,
          });
        });
      }
    }

    // Second pass: Create schools with their complete data
    for (const [schoolName, schoolData] of schoolsMap) {
      try {
        // Check if school already exists
        const existingSchool = await this.schoolService.findByName(schoolName);
        if (existingSchool) {
          results.push({
            school: schoolName,
            status: 'Skipped',
            reason: 'School already exists',
          });
          continue;
        }

        // Create the school with all its collected data
        const createdSchool = await this.schoolService.createWithRelations({
          schoolData: {
            name: schoolData.name,
            type: schoolData.type,
            isOpen: schoolData.isOpen,
          },
          bacOptionNames:
            schoolData.filieresWithBacOptions.length > 0
              ? Array.from(
                  new Set(
                    schoolData.filieresWithBacOptions.flatMap(
                      (f) => f.bacOptions,
                    ),
                  ),
                )
              : schoolData.defaultBacOptions, // Use defaultBacOptions if no filières exist
          cityNames: schoolData.cities,
          filieresWithBacOptions: schoolData.filieresWithBacOptions,
        });

        results.push({
          school: createdSchool.name,
          status: 'Created',
        });
      } catch (error) {
        results.push({
          school: schoolName,
          status: 'Error',
          reason: error?.response?.message || error.message,
        });
      }
    }

    return { summary: results };
  }
}
