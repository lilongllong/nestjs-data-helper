import { Injectable, Logger } from '@nestjs/common';
import {
  MinioService as NestMinioService,
  MinioModuleOptions,
} from 'nestjs-minio-module';

type Options = {
  bucketName?: string;
} & MinioModuleOptions;

@Injectable()
export class MinioService extends NestMinioService {
  constructor(readonly options: Options) {
    super(options);
  }
  async upload(fileName: string, file: Buffer, type: string) {
    return this.putObject(this.options.bucketName, fileName, file, {
      'Content-Type': type,
    });
  }

  async download(fileName: string) {
    Logger.log(`读取文件-${fileName}`);
    return this.getObject(this.options.bucketName, fileName);
  }
}
