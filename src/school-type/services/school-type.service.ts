import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSchoolTypeDto } from '../dto/create-school-type.dto';
import { UpdateSchoolTypeDto } from '../dto/update-school-type.dto';
import { SchoolTypeRepository } from '../repositories/school-type.repository';

@Injectable()
export class SchoolTypeService {
  constructor(private readonly schoolTypeRepository: SchoolTypeRepository) {}

  async create(createSchoolTypeDto: CreateSchoolTypeDto) {
    // Check if school type with same code exists
    const existing = await this.schoolTypeRepository.findByCode(createSchoolTypeDto.code);
    if (existing) {
      throw new ConflictException(`School type with code ${createSchoolTypeDto.code} already exists`);
    }

    return await this.schoolTypeRepository.create(createSchoolTypeDto);
  }

  async findAll() {
    return await this.schoolTypeRepository.findAll();
  }

  async findOne(id: string) {
    const schoolType = await this.schoolTypeRepository.findOne(id);
    if (!schoolType) {
      throw new NotFoundException(`School type with ID ${id} not found`);
    }
    return schoolType;
  }

  async findByCode(code: string) {
    const schoolType = await this.schoolTypeRepository.findByCode(code);
    if (!schoolType) {
      throw new NotFoundException(`School type with code ${code} not found`);
    }
    return schoolType;
  }

  async update(id: string, updateSchoolTypeDto: UpdateSchoolTypeDto) {
    // Check if school type exists
    const schoolType = await this.schoolTypeRepository.findOne(id);
    if (!schoolType) {
      throw new NotFoundException(`School type with ID ${id} not found`);
    }

    // If code is being updated, check if new code already exists
    if (updateSchoolTypeDto.code && updateSchoolTypeDto.code !== schoolType.code) {
      const existingWithCode = await this.schoolTypeRepository.findByCode(updateSchoolTypeDto.code);
      if (existingWithCode) {
        throw new ConflictException(`School type with code ${updateSchoolTypeDto.code} already exists`);
      }
    }

    return await this.schoolTypeRepository.update(id, updateSchoolTypeDto);
  }

  async remove(id: string) {
    // Check if school type exists and has no schools
    const schoolType = await this.schoolTypeRepository.findOne(id);
    if (!schoolType) {
      throw new NotFoundException(`School type with ID ${id} not found`);
    }

    if (schoolType.schools.length > 0) {
      throw new ConflictException(`Cannot delete school type that has schools associated with it`);
    }

    await this.schoolTypeRepository.remove(id);
  }
} 