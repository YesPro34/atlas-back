import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSchoolDto } from '../dto/create-school.dto';
import { UpdateSchoolDto } from '../dto/update-school.dto';
import { BacOption } from '@prisma/client';
import { BacOptionEntity } from 'src/bac-option/bacOption.entity';

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

  async filterByBacOption(bacOption: BacOptionEntity) {
    // Assuming BacOptionEntity has a 'name' property that matches BacOption enum keys
    const bacOptionKey = (bacOption as any).name as keyof typeof BacOption;
    const bacOptionEnum = BacOption[bacOptionKey];
    if (!bacOptionEnum) {
      throw new Error(`Invalid BAC option: ${JSON.stringify(bacOption)}`);
    }
    return await this.prisma.school.findMany({
      where: {
        bacOptionsAllowed: {
          has: bacOptionEnum,
        },
        isOpen: true,
      },
    });
  }
}
