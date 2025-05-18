import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { BacOption, Prisma } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByCodeMassar(massarCode: string) {
    return await this.prisma.user.findUnique({ where: { massarCode } });
  }

  async create(user: CreateUserDto) {
    const data = {
      ...user,
      bacOption: user.bacOption ?? null,
    };
    return await this.prisma.user.create({ data });
  }

  async findAll() {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        massarCode: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        bacOption: true,
        city: true,
        nationalMark: true,
        generalMark: true,
        mathMark: true,
        physicMark: true,
        svtMark: true,
        englishMark: true,
        philosophyMark: true,
      },
    });
  }

  async findStudents() {
    return await this.prisma.user.findMany({
      where: {
        role: 'STUDENT',
      },
      select: {
        id: true,
        massarCode: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        bacOption: true,
        city: true,
      },
    });
  }

  async findById(id: string) {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async update(id: string, user: any) {
    return await this.prisma.user.update({
      where: { id },
      data: user,
    });
  }

  async delete(id: string) {
    return await this.prisma.user.delete({ where: { id } });
  }

}
