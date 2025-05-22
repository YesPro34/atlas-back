import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSchoolDto } from '../dto/create-school.dto';
import { UpdateSchoolDto } from '../dto/update-school.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class SchoolRepository {
  constructor(private readonly prisma: PrismaService) {}

  private readonly defaultInclude = {
    cities: true,
    bacOptionsAllowed: true,
    filieres: {
      include: {
        bacOptionsAllowed: true,
      },
    },
  } as const;

  async create(createSchoolDto: CreateSchoolDto) {
    const { cityIds, bacOptionIds, typeId, ...schoolData } = createSchoolDto;

    return await this.prisma.school.create({
      data: {
        ...schoolData,
        typeId,
        cities: cityIds ? {
          connect: cityIds.map((id) => ({ id })),
        } : undefined,
        bacOptionsAllowed: bacOptionIds ? {
          connect: bacOptionIds.map((id) => ({ id })),
        } : undefined,
      },
      include: this.defaultInclude,
    });
  }

  async findAll() {
    return await this.prisma.school.findMany({
      include: this.defaultInclude,
    });
  }

  async findOne(id: string) {
    return await this.prisma.school.findUnique({
      where: { id },
      include: this.defaultInclude,
    });
  }

  async findByName(name: string) {
    return await this.prisma.school.findFirst({
      where: { name },
      include: this.defaultInclude,
    });
  }

  async update(id: string, updateSchoolDto: UpdateSchoolDto) {
    const { cityIds, bacOptionIds, typeId, ...schoolData } = updateSchoolDto;

    return await this.prisma.school.update({
      where: { id },
      data: {
        ...schoolData,
        typeId,
        cities: cityIds ? {
          set: cityIds.map((id) => ({ id })),
        } : undefined,
        bacOptionsAllowed: bacOptionIds ? {
          set: bacOptionIds.map((id) => ({ id })),
        } : undefined,
      },
      include: this.defaultInclude,
    });
  }

  async remove(id: string) {
    await this.prisma.school.delete({
      where: { id },
    });
  }

  async filterByBacOption(bacOptionName: string) {
    return await this.prisma.school.findMany({
      where: {
        bacOptionsAllowed: {
          some: {
            name: bacOptionName,
          },
        },
        isOpen: true,
      },
      include: this.defaultInclude,
    });
  }
}
