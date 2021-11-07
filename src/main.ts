import { NestFactory } from '@nestjs/core';
import { MainModule } from './main.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { setupSwagger } from './helpers/swagger';
// import { LoggerMiddleware } from './middleware/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(MainModule);
  // app.use(LoggerMiddleware);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix('api');
  setupSwagger(app);
  await app.listen(3000);
}
bootstrap();
