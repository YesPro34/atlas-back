import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSchoolTypeDto } from '../dto/create-school-type.dto';
import { UpdateSchoolTypeDto } from '../dto/update-school-type.dto';

@Injectable()
export class SchoolTypeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSchoolTypeDto: CreateSchoolTypeDto) {
    return await this.prisma.schoolType.create({
      data: createSchoolTypeDto,
      include: {
        schools: true,
      },
    });
  }

  async findAll() {
    return await this.prisma.schoolType.findMany({
      include: {
        schools: true,
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.schoolType.findUnique({
      where: { id },
      include: {
        schools: true,
      },
    });
  }

  async findByCode(code: string) {
    const result = await this.prisma.schoolType.findUnique({
      where: { code },
      include: {
        schools: true,
      },
    });
    return result;
  }

  async update(id: string, updateSchoolTypeDto: UpdateSchoolTypeDto) {
    return await this.prisma.schoolType.update({
      where: { id },
      data: updateSchoolTypeDto,
      include: {
        schools: true,
      },
    });
  }

  async remove(id: string) {
    await this.prisma.schoolType.delete({
      where: { id },
    });
  }
}
