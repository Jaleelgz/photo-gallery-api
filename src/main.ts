import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './exception/global.exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.setGlobalPrefix('/api');

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new GlobalExceptionFilter());

  const adminConfig: ServiceAccount = {
    projectId: process.env.AUTH_FIREBASE_PROJECT_ID,
    privateKey: process.env.AUTH_FIREBASE_PrivateKey.replace(/\\n/g, '\n'),
    clientEmail: process.env.AUTH_FIREBASE_ClientEmail,
  };
  // Initialize the firebase admin app
  admin.initializeApp({
    credential: admin.credential.cert(adminConfig),
    storageBucket: process.env.BUCKET_URL,
  });

  const config = new DocumentBuilder()
    .setTitle('Photo Gallery Nest API')
    .setDescription('This API defines all the Photo Gallery operations')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/swagger', app, document);

  app.enableCors();

  await app.listen(3003 || process.env.PORT);
}
bootstrap();
