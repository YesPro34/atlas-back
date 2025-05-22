import { Module } from '@nestjs/common';
import { BacOptionController } from './controllers/bac-option.controller';
import { BacOptionService } from './services/bac-option.service';
import { BacOptionRepository } from './repositories/bac-option.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BacOptionController],
  providers: [BacOptionService, BacOptionRepository],
  exports: [BacOptionService],
})
export class BacOptionModule {}
