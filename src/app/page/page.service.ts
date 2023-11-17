import { Injectable } from '@nestjs/common';

import { PuppeteerService } from '../puppeteer/puppeteer.service';
import PDFDTO from './dto/pdf-page.dto';
import ScreenshotDTO from './dto/screenshot-page.dto';

@Injectable()
export class PageService {
  constructor(private readonly puppeteerService: PuppeteerService) {}

  async screenshot(params: ScreenshotDTO): Promise<Buffer | string> {
    const buffer = await this.puppeteerService.runImageTask(params);
    return buffer;
  }

  async pdf(params: PDFDTO): Promise<Buffer | string> {
    return this.puppeteerService.runPDFTask(params);
  }
}
