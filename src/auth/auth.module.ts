import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthRepository } from './repositories/auth.repository';
import { AuthDomainService } from './services/domain/auth.domain.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    UserModule,
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthDomainService, JwtStrategy, AuthRepository],
})
export class AuthModule {}
