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
import { BacOptionEntity } from 'src/bac-option/bacOption.entity';
import { CityEntity } from 'src/city/entities/city.entity';

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

  async createWithRelations({
    schoolData,
    bacOptionNames,
    cityNames,
  }: CreateSchoolWithRelations): Promise<School> {
    // Find all the bac options by name
    const bacOptions: BacOptionEntity[] = await this.prisma.bacOption.findMany({
      where: {
        name: {
          in: bacOptionNames,
        },
      },
    });

    // Find all the cities by name
    const cities: CityEntity[] = await this.prisma.city.findMany({
      where: {
        name: {
          in: cityNames,
        },
      },
    });

    // Create the school with connections to bac options and cities
    const school: School = await this.prisma.school.create({
      data: {
        ...schoolData,
        // Connect the school to existing bac options
        bacOptionsAllowed: {
          connect: bacOptions.map((option) => ({ id: option.id })),
        },
        // Connect the school to existing cities
        cities: {
          connect: cities.map((city) => ({ id: city.id })),
        },
      },
    });

    return school;
  }
}
