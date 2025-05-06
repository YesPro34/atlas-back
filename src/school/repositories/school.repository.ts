import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSchoolDto, UpdateSchoolDto } from '../dto/create-school.dto';

@Injectable()
export class SchoolRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateSchoolDto) {
    return this.prisma.school.create({ data });
  }

  async findAll() {
    return this.prisma.school.findMany();
  }

  async findOne(id: string) {
    return this.prisma.school.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateSchoolDto) {
    return this.prisma.school.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.school.delete({ where: { id } });
  }
}
