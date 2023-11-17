import { Injectable, Logger } from '@nestjs/common';

import { PuppeteerService } from '../puppeteer/puppeteer.service';
import PDFDTO from './dto/pdf-page.dto';
import ScreenshotDTO from './dto/screenshot-page.dto';
import { MinioService } from '../minio/minio.service';

@Injectable()
export class PageService {
  constructor(
    private readonly puppeteerService: PuppeteerService,
    private readonly minioService: MinioService,
  ) {}

  async screenshot(params: ScreenshotDTO): Promise<Buffer | string> {
    const buffer = await this.puppeteerService.runImageTask(params);
    const result = await this.minioService.upload(
      `screenshot_${new Date().valueOf()}.png`,
      buffer as Buffer,
      'image/png',
    );
    Logger.log('minio upload successfully:', result);
    return buffer;
  }

  async pdf(params: PDFDTO): Promise<Buffer | string> {
    return this.puppeteerService.runPDFTask(params);
  }
}
