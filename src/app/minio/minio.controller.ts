import {
  Controller,
  Get,
  HttpCode,
  Logger,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { MinioService } from './minio.service';
import { Response } from 'express';
import urlencode = require('urlencode');
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('minio')
export class MinioController {
  constructor(private minioService: MinioService) {}

  @Get('download')
  @HttpCode(200)
  async download(
    @Query('fileName') fileName: string,
    @Res() response: Response,
  ) {
    const attachFileName = urlencode(fileName, 'utf-8');
    response.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename=${attachFileName}`,
    });
    const readStream = await this.minioService.download(attachFileName);
    readStream.pipe(response);
  }

  @Post('upload')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file) {
    const { originalname, mimetype, buffer } = file;
    const name = Buffer.from(originalname, 'latin1').toString('utf8');
    const fileName = urlencode(name, 'utf-8');
    return this.minioService.upload(fileName, buffer, mimetype);
  }
}
