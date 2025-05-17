import { Module } from '@nestjs/common';
import { CityController } from './controllers/city.controller';
import { CityService } from './services/city.service';
import { CityRepository } from './repositories/city.repository';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CityController],
  providers: [CityService, CityRepository],
})
export class CityModule {}
