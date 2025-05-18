import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSchoolDto } from '../dto/create-school.dto';
import { UpdateSchoolDto } from '../dto/update-school.dto';
import { BacOption } from '@prisma/client';

@Injectable()
export class SchoolRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateSchoolDto) {
    return await this.prisma.school.create({ data });
  }

  async findAll() {
    return await this.prisma.school.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.school.findUnique({ where: { id } });
  }

  async findByName(name: string) {
    return await this.prisma.school.findFirst({ where: { name } });
  }

  async update(id: string, data: UpdateSchoolDto) {
    return await this.prisma.school.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.prisma.school.delete({ where: { id } });
  }

  async filterByBacOption(bacOption: string) {
    // Assuming BacOption is imported or accessible here
    // Convert string to proper enum value
    const bacOptionEnum = BacOption[bacOption as keyof typeof BacOption];
    if (!bacOptionEnum) {
      throw new Error(`Invalid BAC option: ${bacOption}`);
    }
    return await this.prisma.school.findMany({
      where: {
        bacOptionsAllowed: {
          has: bacOptionEnum,
        },
        isOpen: true,
      }
    });
  }

}
