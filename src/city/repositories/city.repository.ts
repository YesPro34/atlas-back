import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCityDto } from '../dto/create-city.dto';
import { UpdateCityDto } from '../dto/update.city.dto';

@Injectable()
export class CityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCityDto) {
    return await this.prisma.city.create({ data });
  }

  async findAll() {
    return await this.prisma.city.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.city.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateCityDto) {
    return await this.prisma.city.update({ where: { id }, data });
  }

  async delete(id: string) {
    return await this.prisma.city.delete({ where: { id } });
  }
}
