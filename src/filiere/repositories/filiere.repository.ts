import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFiliereDto } from '../dto/create-filiere.dto';
import { UpdateFiliereDto } from '../dto/update-filiere.dto';

@Injectable()
export class FiliereRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateFiliereDto) {
    return this.prisma.filiere.create({ data });
  }

  async findAll() {
    return this.prisma.filiere.findMany({ include: { school: true } });
  }

  async findOne(id: string) {
    return this.prisma.filiere.findUnique({
      where: { id },
      include: { school: true },
    });
  }

  async update(id: string, data: UpdateFiliereDto) {
    return this.prisma.filiere.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.filiere.delete({ where: { id } });
  }
}
