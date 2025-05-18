import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRepository } from './repositories/user.repository';
import { SchoolRepository } from 'src/school/repositories/school.repository';

@Module({
  providers: [UserService, PrismaService, UserRepository, SchoolRepository],
  exports: [UserService],
})
export class UserModule {}
