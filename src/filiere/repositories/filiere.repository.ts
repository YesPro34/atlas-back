import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFiliereDto } from '../dto/create-filiere.dto';
import { UpdateFiliereDto } from '../dto/update-filiere.dto';

@Injectable()
export class FiliereRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFiliereDto: CreateFiliereDto) {
    return await this.prisma.filiere.create({
      data: {
        name: createFiliereDto.name,
        school: {
          connect: { id: createFiliereDto.schoolId }
        },
        bacOptionsAllowed: {
          connect: createFiliereDto.bacOptionIds.map(id => ({ id })),
        },
      },
      include: {
        school: true,
        bacOptionsAllowed: true,
      },
    });
  }

  async findAll() {
    return await this.prisma.filiere.findMany({
      include: {
        school: true,
        bacOptionsAllowed: true,
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.filiere.findUnique({
      where: { id },
      include: {
        school: true,
        bacOptionsAllowed: true,
      },
    });
  }

  async update(id: string, updateFiliereDto: UpdateFiliereDto) {
    const data: any = {};

    if (updateFiliereDto.name) {
      data.name = updateFiliereDto.name;
    }

    if (updateFiliereDto.schoolId) {
      data.school = {
        connect: { id: updateFiliereDto.schoolId }
      };
    }

    if (updateFiliereDto.bacOptionIds) {
      data.bacOptionsAllowed = {
        set: [], // First disconnect all existing connections
        connect: updateFiliereDto.bacOptionIds.map(id => ({ id })),
      };
    }

    return await this.prisma.filiere.update({
      where: { id },
      data,
      include: {
        school: true,
        bacOptionsAllowed: true,
      },
    });
  }

  async remove(id: string) {
    await this.prisma.filiere.delete({
      where: { id },
    });
  }
}
