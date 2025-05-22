import { Module } from '@nestjs/common';
import { ApplicationController } from './controllers/application.controller';
import { ApplicationService } from './services/application.service';
// import { ApplicationRepository } from './repositories/application.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { SchoolRepository } from 'src/school/repositories/school.repository';
import { UserRepository } from 'src/user/repositories/user.repository';

@Module({
  controllers: [ApplicationController],
  providers: [
    PrismaService,
    ApplicationService,
    SchoolRepository,
    UserRepository,
  ],
})
export class ApplicationModule {}
