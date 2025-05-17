import {
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SchoolRepository } from '../repositories/school.repository';
import { CreateSchoolDto } from '../dto/create-school.dto';
import { UpdateSchoolDto } from '../dto/update-school.dto';

@Injectable()
@Injectable()
export class SchoolService {
  constructor(private readonly schoolRepo: SchoolRepository) {}

  async create(createSchoolDto: CreateSchoolDto) {
    const existingSchool = await this.schoolRepo.findByName(
      createSchoolDto.name,
    );
    if (existingSchool) {
      return new ConflictException('the School is already exist');
    }
    try {
      await this.schoolRepo.create(createSchoolDto);
    } catch (error: any) {
      throw new InternalServerErrorException('create school Faild ');
    }
  }

  async findAll() {
    return await this.schoolRepo.findAll();
  }

  async findOne(id: string) {
    const school = await this.schoolRepo.findOne(id);
    if (!school) throw new NotFoundException('School not found');
    return school;
  }

  async update(id: string, updateSchoolDto: UpdateSchoolDto) {
    const school = await this.schoolRepo.findOne(id);
    if (!school) throw new NotFoundException('School not found');
    try {
      return await this.schoolRepo.update(id, updateSchoolDto);
    } catch (error: any) {
      throw new InternalServerErrorException('update school  Faild ');
    }
  }

  async remove(id: string) {
    return await this.schoolRepo.remove(id);
  }
}
