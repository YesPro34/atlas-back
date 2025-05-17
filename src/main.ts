import { NestFactory, Reflector } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// import { LocalAuthGuard } from './auth/guards/local-auth/local-auth.guard';
// import { JwtAuthGuard } from './auth/guards/jwt-auth/jwt-auth.guard';
// import { RefreshAuthGuard } from './auth/guards/refresh-auth/refresh-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable CORS
  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  // global validation
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 8080);
}
void bootstrap();
