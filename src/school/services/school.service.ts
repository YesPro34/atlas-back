import { Injectable, NotFoundException } from '@nestjs/common';
import { SchoolRepository } from '../repositories/school.repository';
import { CreateSchoolDto, UpdateSchoolDto } from '../dto/create-school.dto';

@Injectable()
@Injectable()
export class SchoolService {
  constructor(private readonly schoolRepo: SchoolRepository) {}

  async create(createSchoolDto: CreateSchoolDto) {
    return this.schoolRepo.create(createSchoolDto);
  }

  async findAll() {
    return this.schoolRepo.findAll();
  }

  async findOne(id: string) {
    const school = await this.schoolRepo.findOne(id);
    if (!school) throw new NotFoundException('School not found');
    return school;
  }

  async update(id: string, updateSchoolDto: UpdateSchoolDto) {
    await this.findOne(id); // check existence
    return this.schoolRepo.update(id, updateSchoolDto);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.schoolRepo.remove(id);
  }
}
