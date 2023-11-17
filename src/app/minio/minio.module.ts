import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MinioModule as NestMinioModule } from 'nestjs-minio-module';

import { MinioService } from './minio.service';
import { MinioController } from './minio.controller';

@Global()
@Module({
  imports: [
    NestMinioModule.registerAsync({
      useFactory: (cfg: ConfigService) => ({
        endPoint: cfg.get('MINIO_ENDPOINT'),
        port: Number(cfg.get('MINIO_PORT')),
        accessKey: cfg.get('MINIO_ACCESS_KEY'),
        secretKey: cfg.get('MINIO_SECRET_KEY'),
        bucketName: cfg.get('MINIO_BUCKET_NAME'),
        useSSL: false,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MinioService, ConfigService],
  controllers: [MinioController],
  exports: [MinioService],
})
export class MinioModule {}
