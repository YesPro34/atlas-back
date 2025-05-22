import { Module } from '@nestjs/common';
import { CityController } from './controllers/city.controller';
import { CityService } from './services/city.service';
import { CityRepository } from './repositories/city.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CityController],
  providers: [CityService, CityRepository],
  exports: [CityService],
})
export class CityModule {}
