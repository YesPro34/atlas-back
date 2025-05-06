import { Module } from '@nestjs/common';
import { SchoolService } from './services/school.service';
import { SchoolController } from './controllers/school.controller';
import { SchoolRepository } from './repositories/school.repository';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [SchoolService, SchoolRepository],
  controllers: [SchoolController],
})
export class SchoolModule {}
