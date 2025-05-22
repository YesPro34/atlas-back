import { Module } from '@nestjs/common';
import { SchoolService } from './services/school.service';
import { SchoolController } from './controllers/school.controller';
import { SchoolRepository } from './repositories/school.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { SchoolTypeModule } from '../school-type/school-type.module';

@Module({
  imports: [PrismaModule, SchoolTypeModule],
  controllers: [SchoolController],
  providers: [SchoolService, SchoolRepository],
  exports: [SchoolService],
})
export class SchoolModule {}
