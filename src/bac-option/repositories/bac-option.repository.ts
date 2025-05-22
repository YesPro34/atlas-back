import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBacOptionDto } from '../dto/create-bac-option.dto';
import { UpdateBacOptionDto } from '../dto/update-bac-option.dto';

@Injectable()
export class BacOptionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBacOptionDto: CreateBacOptionDto) {
    return await this.prisma.bacOption.create({
      data: {
        name: createBacOptionDto.name,
      },
      include: {
        schools: true,
        users: true,
      },
    });
  }

  async findAll() {
    return await this.prisma.bacOption.findMany({
      include: {
        schools: true,
        users: true,
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.bacOption.findUnique({
      where: { id },
      include: {
        schools: true,
        users: true,
      },
    });
  }

  async update(id: string, updateBacOptionDto: UpdateBacOptionDto) {
    return await this.prisma.bacOption.update({
      where: { id },
      data: {
        name: updateBacOptionDto.name,
      },
      include: {
        schools: true,
        users: true,
      },
    });
  }

  async remove(id: string) {
    await this.prisma.bacOption.delete({
      where: { id },
    });
  }
}
