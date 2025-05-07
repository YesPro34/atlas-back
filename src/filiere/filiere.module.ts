import { Module } from '@nestjs/common';
import { FiliereController } from './controllers/filiere.controller';
import { FiliereService } from './services/filiere.service';
import { FiliereRepository } from './repositories/filiere.repository';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FiliereController],
  providers: [FiliereService, FiliereRepository],
})
export class FiliereModule {}
