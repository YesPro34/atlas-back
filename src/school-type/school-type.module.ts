import { Module } from '@nestjs/common';
import { SchoolTypeService } from './services/school-type.service';
import { SchoolTypeController } from './controllers/school-type.controller';
import { SchoolTypeRepository } from './repositories/school-type.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SchoolTypeController],
  providers: [SchoolTypeService, SchoolTypeRepository],
  exports: [SchoolTypeService],
})
export class SchoolTypeModule {}
