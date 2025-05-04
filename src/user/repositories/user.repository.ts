import { PrismaService } from 'src/prisma/prisma.service';

export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByCodeMassar(massarCode: string) {
    return await this.prisma.user.findUnique({ where: { massarCode } });
  }
}
