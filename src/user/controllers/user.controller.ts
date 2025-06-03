import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Patch,
  UploadedFile,
  UseInterceptors,
  Request,
  Put,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserService } from '../services/user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import * as XLSX from 'xlsx';
import { diskStorage } from 'multer';
import { Role, UserStatus } from '@prisma/client';
import { File } from 'multer';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { BacOptionEntity } from 'src/bac-option/bacOption.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateGradesDto } from '../dto/update-grades.dto';
import { UseGuards } from '@nestjs/common';

interface ExcelRow {
  mot_de_passe: string;
  massar_code: string;
  prenom: string;
  nom: string;
  role: string;
  status: string;
  option_bac?: string;
  ville?: string;
  note_nationale?: string;
  note_globale?: string;
  note_math?: string;
  note_physique?: string;
  note_svt?: string;
  note_anglais?: string;
  note_philosophie?: string;
  note_comptabilite?: string;
  note_economie?: string;
  note_management?: string;
}

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly prisma: PrismaService
  ) {}

  @Roles('ADMIN')
  @Get()
  findAllUsers() {
    return this.userService.findAllUsers();
  }

  @Roles('ADMIN')
  @Post()
  @HttpCode(201)
  createUser(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return this.userService.createUser(createUserDto);
  }

  @Roles('ADMIN')
  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Roles('ADMIN')
  @Delete(':id')
  @HttpCode(204)
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  @Roles('ADMIN')
  @Get('/students')
  getAllStudents() {
    return this.userService.findStudents();
  }

  @Roles('ADMIN', 'STUDENT')
  @Get('/mySchools/:bacOption')
  getSchoolsByBacOption(@Param('bacOption') bacOption: string) {
    return this.userService.findSchoolsByBacOption(bacOption);
  }

  @Get('/profile/:id')
  async getUserProfile(@Param('id') id: string) {
    return this.userService.findUserProfile(id);
  }

  @Post('upload-excel')
  @HttpCode(201)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) =>
          cb(null, `${Date.now()}-${file.originalname}`),
      }),
    }),
  )
  async uploadUsersFromExcel(@UploadedFile() file: any) {
    const workbook = XLSX.readFile(file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);
    const results: { massarCode: string; status: string; reason?: string }[] =
      [];

    for (const row of rows as ExcelRow[]) {
      try {
        // First find the bacOption by name
        const bacOption = await this.prisma.bacOption.findUnique({
          where: { name: row.option_bac || '' }
        });

        const createUserDto: CreateUserDto = {
          password: String(row.mot_de_passe),
          massarCode: String(row.massar_code),
          firstName: String(row.prenom),
          lastName: String(row.nom),
          role: row.role as Role,
          status: row.status as UserStatus,
          bacOptionId: bacOption?.id,
          city: String(row.ville),
          nationalMark: parseFloat(String(row.note_nationale)) ?? null,
          generalMark: parseFloat(String(row.note_globale)) ?? null,
          mathMark: parseFloat(String(row.note_math)) ?? null,
          physicMark: parseFloat(String(row.note_physique)) ?? null,
          svtMark: parseFloat(String(row.note_svt)) ?? null,
          englishMark: parseFloat(String(row.note_anglais)) ?? null,
          philosophyMark: parseFloat(String(row.note_philosophie)) ?? null,
          comptabilityMark: parseFloat(String(row.note_comptabilite)) ?? null,
          economyMark: parseFloat(String(row.note_economie)) ?? null,
          managementMark: parseFloat(String(row.note_management)) ?? null,
        };

        await this.userService.createUser(createUserDto);
        results.push({
          massarCode: createUserDto.massarCode,
          status: 'Created',
        });
      } catch (error) {
        results.push({
          massarCode: row.massar_code,
          status: 'Error',
          reason: error?.response?.message || error.message,
        });
      }
    }

    return { summary: results };
  }

  @Put('update-grades/:id')
  @UseGuards(JwtAuthGuard)
  async updateGrades(
    @Param('id') id: string,
    @Body() updateGradesDto: UpdateGradesDto,
  ) {
    return await this.userService.updateGrades(id, updateGradesDto);
  }
}
