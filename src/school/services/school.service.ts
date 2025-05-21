import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SchoolRepository } from '../repositories/school.repository';
import { CreateSchoolDto } from '../dto/create-school.dto';
import { UpdateSchoolDto } from '../dto/update-school.dto';
import { SchoolType } from '@prisma/client';
import { School } from '../entities/school.entity';
import { PrismaService } from 'src/prisma/prisma.service';

// Define the data structure for creating a school
interface IcreateSchoolData {
  name: string;
  type: SchoolType;
  isOpen: boolean;
}

// Data needed to create a school with all its relations
interface CreateSchoolWithRelations {
  schoolData: IcreateSchoolData;
  bacOptionNames: string[];
  cityNames: string[];
}

@Injectable()
export class SchoolService {
  constructor(
    private readonly schoolRepo: SchoolRepository,
    private readonly prisma: PrismaService
  ) {}

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
      throw new InternalServerErrorException('create school Failed');
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
      throw new InternalServerErrorException('update school Failed');
    }
  }

  async remove(id: string) {
    return await this.schoolRepo.remove(id);
  }

  async createWithRelations({
    schoolData,
    bacOptionNames,
    cityNames,
  }: CreateSchoolWithRelations): Promise<School> {
    // Create the school with connections to bac options and cities
    const school: School = await this.prisma.school.create({
      data: {
        ...schoolData,
        // Connect the school to existing bac options
        bacOptionsAllowed: {
          connect: bacOptionNames.map((name) => ({ name })),
        },
        // Connect the school to existing cities
        cities: {
          connect: cityNames.map((name) => ({ name })),
        },
      },
      include: {
        bacOptionsAllowed: true,
        cities: true
      }
    });

    return school;
  }
}
