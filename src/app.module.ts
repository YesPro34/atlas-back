import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/controllers/user.controller';
import { UserModule } from './user/user.module';
import { SchoolModule } from './school/school.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { FiliereModule } from './filiere/filiere.module';
import { CityModule } from './city/city.module';
import jwtConfig from './auth/config/jwt.config';
import refreshConfig from './auth/config/refresh.config';
import { BacOptionModule } from './bac-option/bac-option.module';
import { SchoolTypeModule } from './school-type/school-type.module';
import { ApplicationModule } from './application/application.module';
import { ExportModule } from './export/export.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [
    UserModule,
    SchoolModule,
    PrismaModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshConfig),
    FiliereModule,
    CityModule,
    BacOptionModule,
    SchoolTypeModule,
    ApplicationModule,
    ExportModule,
    SettingsModule,
  ],
  controllers: [AppController, UserController],
  providers: [AppService],
})
export class AppModule {}
