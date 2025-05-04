import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRepository } from './repositories/user.repository';

@Module({
  providers: [UserService, PrismaService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
