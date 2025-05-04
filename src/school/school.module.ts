import { Module } from '@nestjs/common';
import { SchoolService } from './services/school.service';
import { SchoolController } from './controllers/school.controller';

@Module({
  providers: [SchoolService],
  controllers: [SchoolController],
})
export class SchoolModule {}
