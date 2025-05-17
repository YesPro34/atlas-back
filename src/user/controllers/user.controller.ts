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
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserService } from '../services/user.service';
// import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import * as XLSX from 'xlsx';
import { diskStorage } from 'multer';
import { BacOption, Role, UserStatus } from '@prisma/client';
import { File } from 'multer';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
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
}

@Roles('ADMIN')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAllUsers() {
    return this.userService.findAllUsers();
  }

  @Post()
  @HttpCode(201)
  createUser(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return this.userService.createUser(createUserDto);
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(204)
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  @Get('/students')
  getAllStudents() {
    return this.userService.findStudents();
  }

  @Get('/mySchools')
  getSchoolsByBacOption(@Request() req) {
    console.log(req)
    return this.userService.findSchoolsByBacOption(req.user.bacOption);
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
  async uploadUsersFromExcel(@UploadedFile() file: File.Multer.File) {
    const workbook = XLSX.readFile(file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    const results: { massarCode: string; status: string; reason?: string }[] =
      [];

    for (const row of rows as ExcelRow[]) {
      const createUserDto: CreateUserDto = {
        password: String(row.mot_de_passe),
        massarCode: String(row.massar_code),
        firstName: String(row.prenom),
        lastName: String(row.nom),
        role: row.role as Role,
        status: row.status as UserStatus,
        bacOption: row.option_bac as BacOption,
        city: String(row.ville),
        nationalMark: parseFloat(row.note_nationale ?? '0'),
        generalMark: parseFloat(row.note_globale ?? '0'),
        mathMark: parseFloat(row.note_math ?? '0'),
        physicMark: parseFloat(row.note_physique ?? '0'),
        svtMark: parseFloat(row.note_svt ?? '0'),
        englishMark: parseFloat(row.note_anglais ?? '0'),
        philosophyMark: parseFloat(row.note_philosophie ?? '0'),
      };

      try {
        await this.userService.createUser(createUserDto);
        results.push({
          massarCode: createUserDto.massarCode,
          status: 'Created',
        });
      } catch (error) {
        results.push({
          massarCode: createUserDto.massarCode,
          status: 'Error',
          reason: error?.response?.message || error.message,
        });
      }
    }

    return { summary: results };
  }
}
