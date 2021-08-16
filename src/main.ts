import { NestFactory } from '@nestjs/core';
import { MainModule } from './main.module';
// import { LoggerMiddleware } from './middleware/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(MainModule);
  // app.use(LoggerMiddleware);
  await app.listen(3000);
}
bootstrap();
