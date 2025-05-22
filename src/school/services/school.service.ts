import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SchoolRepository } from '../repositories/school.repository';
import { CreateSchoolDto } from '../dto/create-school.dto';
import { UpdateSchoolDto } from '../dto/update-school.dto';
import { School } from '../entities/school.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { SchoolTypeService } from '../../school-type/services/school-type.service';

interface FiliereWithBacOptions {
  name: string;
  bacOptions: string[];
}

// Data needed to create a school with all its relations
interface CreateSchoolWithRelations {
  name: string;
  typeId: string;
  isOpen: boolean;
  bacOptionNames: string[];
  cityNames: string[];
  filieresWithBacOptions: FiliereWithBacOptions[];
}

@Injectable()
export class SchoolService {
  constructor(
    private readonly schoolRepo: SchoolRepository,
    private readonly prisma: PrismaService,
    private readonly schoolTypeService: SchoolTypeService,
  ) {}

  async findByName(name: string) {
    if (!name) return null;
    return await this.prisma.school.findFirst({
      where: { name },
      include: {
        bacOptionsAllowed: true,
        cities: true,
        filieres: {
          include: {
            bacOptionsAllowed: true,
          },
        },
      },
    });
  }

  async create(createSchoolDto: CreateSchoolDto) {
    // Verify that the school type exists
    await this.schoolTypeService.findOne(createSchoolDto.typeId);

    const existingSchool = await this.findByName(createSchoolDto.name);
    if (existingSchool) {
      return new ConflictException('the School is already exist');
    }
    try {
      return await this.schoolRepo.create(createSchoolDto);
    } catch (error: any) {
      throw new InternalServerErrorException('create school Failed');
    }
  }

  async findAll() {
    return await this.schoolRepo.findAll();
  }

  async findOne(id: string) {
    const school = await this.schoolRepo.findOne(id);
    if (!school) {
      throw new NotFoundException(`School with ID ${id} not found`);
    }
    return school;
  }

  async update(id: string, updateSchoolDto: UpdateSchoolDto) {
    // Verify that the school exists
    await this.findOne(id);

    // If typeId is being updated, verify that the new type exists
    if (updateSchoolDto.typeId) {
      await this.schoolTypeService.findOne(updateSchoolDto.typeId);
    }

    return await this.schoolRepo.update(id, updateSchoolDto);
  }

  async remove(id: string) {
    // Verify that the school exists
    await this.findOne(id);

    await this.schoolRepo.remove(id);
  }

  async createWithRelations({
    name,
    typeId,
    isOpen,
    bacOptionNames,
    cityNames,
    filieresWithBacOptions,
  }: CreateSchoolWithRelations): Promise<School> {
    // Verify that the school type exists
    await this.schoolTypeService.findOne(typeId);

    // Create the school with connections to bac options and cities
    const createdSchool = await this.prisma.school.create({
      data: {
        name,
        typeId,
        isOpen,
        // Connect the school to existing bac options
        bacOptionsAllowed: {
          connect: bacOptionNames.map((name) => ({ name })),
        },
        // Connect the school to existing cities
        cities: {
          connect: cityNames.map((name) => ({ name })),
        },
        // Create filières with their specific bac options
        filieres: {
          create: filieresWithBacOptions.map((filiere) => ({
            name: filiere.name.trim().toUpperCase(),
            bacOptionsAllowed: {
              connect: filiere.bacOptions.map((name) => ({ name })),
            },
          })),
        },
      },
      include: {
        type: true,
        bacOptionsAllowed: true,
        cities: true,
        filieres: {
          include: {
            bacOptionsAllowed: true,
          },
        },
      },
    });

    return new School(createdSchool);
  }
}
