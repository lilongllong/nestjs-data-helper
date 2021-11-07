import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export const setupSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .addCookieAuth('scon_a2')
    .addBearerAuth()
    .setTitle('scon-nest-server')
    .setDescription('司空服务后台，基于 Nest.js 开发')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`nest/api`, app, document);
};
