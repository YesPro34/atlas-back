import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSchoolDto } from '../dto/create-school.dto';
import { UpdateSchoolDto } from '../dto/update-school.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class SchoolRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateSchoolDto) {
    const createData: Prisma.SchoolCreateInput = {
      name: data.name,
      type: data.type,
      isOpen: data.isOpen,
      bacOptionsAllowed: {
        connect: data.bacOptionsAllowed.map(name => ({ name }))
      }
    };

    return await this.prisma.school.create({
      data: createData,
      include: {
        bacOptionsAllowed: true
      }
    });
  }

  async findAll() {
    return await this.prisma.school.findMany({
      include: {
        bacOptionsAllowed: true
      }
    });
  }

  async findOne(id: string) {
    return await this.prisma.school.findUnique({
      where: { id },
      include: {
        bacOptionsAllowed: true
      }
    });
  }

  async findByName(name: string) {
    return await this.prisma.school.findFirst({
      where: { name },
      include: {
        bacOptionsAllowed: true
      }
    });
  }

  async update(id: string, data: UpdateSchoolDto) {
    const updateData: Prisma.SchoolUpdateInput = {
      name: data.name,
      type: data.type,
      isOpen: data.isOpen
    };

    if (data.bacOptionsAllowed) {
      updateData.bacOptionsAllowed = {
        set: [], // First disconnect all
        connect: data.bacOptionsAllowed.map(name => ({ name }))
      };
    }
    
    return await this.prisma.school.update({
      where: { id },
      data: updateData,
      include: {
        bacOptionsAllowed: true
      }
    });
  }

  async remove(id: string) {
    await this.prisma.school.delete({ where: { id } });
  }

  async filterByBacOption(bacOptionName: string) {
    return await this.prisma.school.findMany({
      where: {
        bacOptionsAllowed: {
          some: {
            name: bacOptionName
          }
        },
        isOpen: true,
      },
      include: {
        bacOptionsAllowed: true
      }
    });
  }
}
