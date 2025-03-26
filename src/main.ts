import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppExceptionFilter } from './exceptions/app-exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({
    allowedHeaders: ['content-type'],
    origin: '*',
    credentials: true,
  })
  app.useGlobalFilters(new AppExceptionFilter())
  const config = new DocumentBuilder()
    .setTitle('Swyno API')
    .setDescription('Documentação do sistema Swyno')
    .setVersion('0.0.1')
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('swagger', app, documentFactory)
  await app.listen(3000);
}
bootstrap();
