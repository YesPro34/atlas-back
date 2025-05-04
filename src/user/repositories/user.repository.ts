import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByCodeMassar(massarCode: string) {
    return await this.prisma.user.findUnique({ where: { massarCode } });
  }

  async create(data: CreateUserDto): Promise<UserEntity> {
    const user = await this.prisma.user.create({ data: data });
    return new UserEntity(user);
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findById(id: string) {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async update(id: string, user: any) {
    return await this.prisma.user.update({ where: { id }, data: user });
  }
  async delete(id: string) {
    return await this.prisma.user.delete({ where: { id } });
  }
}
