import { NestFactory, Reflector } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join, resolve } from 'path';
// import { LocalAuthGuard } from './auth/guards/local-auth/local-auth.guard';
// import { JwtAuthGuard } from './auth/guards/jwt-auth/jwt-auth.guard';
// import { RefreshAuthGuard } from './auth/guards/refresh-auth/refresh-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Enable CORS
  app.use(cookieParser());

  app.enableCors({
    origin: [
      'https://atlas-front-gzyu.vercel.app', // your current frontend
      'https://atlas-front-gzyu-17936uduh-yassines-projects-4da58e85.vercel.app/',
      'https://atlas-front-gzyu-git-main-yassines-projects-4da58e85.vercel.app/',
      'http://localhost:3000', // local dev
    ],
    credentials: true,
  });

  // global validation
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );



  app.setGlobalPrefix('api');

  // Serve static files from /uploads
  app.useStaticAssets(resolve(__dirname, '../../uploads'), {
    prefix: '/api/uploads/',
  });

  await app.listen(Number(process.env.PORT));
}
void bootstrap();
