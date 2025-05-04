import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable CORS
  app.enableCors({
    origin: true, // Allow all origins in development
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    exposedHeaders: ['set-cookie'],
  });

  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 8080);
}
void bootstrap();
