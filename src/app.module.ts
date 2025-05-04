import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/controllers/user.controller';
import { UserModule } from './user/user.module';
import { SchoolModule } from './school/school.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UserModule, SchoolModule, PrismaModule, AuthModule],
  controllers: [AppController, UserController],
  providers: [AppService],
})
export class AppModule {}
