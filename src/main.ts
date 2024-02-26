import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors();

  const port = configService.get<number>('PORT') || 3000;

  const options = new DocumentBuilder()
      .setTitle('NestJS hiring project API swagger')
      .setDescription('The NestJS REST API documentation')
      .setVersion('1.0')
      .addTag('auth')
      .addTag('articles')
      .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
}
bootstrap();
