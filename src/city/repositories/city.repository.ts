import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCityDto } from '../dto/create-city.dto';
import { UpdateCityDto } from '../dto/update-city.dto';

@Injectable()
export class CityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCityDto: CreateCityDto) {
    return await this.prisma.city.create({
      data: {
        name: createCityDto.name,
      },
    });
  }

  async findAll() {
    return await this.prisma.city.findMany({
      include: {
        schools: true,
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.city.findUnique({
      where: { id },
      include: {
        schools: true,
      },
    });
  }

  async update(id: string, updateCityDto: UpdateCityDto) {
    return await this.prisma.city.update({
      where: { id },
      data: {
        name: updateCityDto.name,
      },
      include: {
        schools: true,
      },
    });
  }

  async remove(id: string) {
    await this.prisma.city.delete({
      where: { id },
    });
  }
}
