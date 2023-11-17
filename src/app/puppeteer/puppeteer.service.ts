import { Inject, Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry, Interval } from '@nestjs/schedule';
import { Cluster } from 'puppeteer-cluster';
import { Page } from 'puppeteer';

import { PDFTaskParams, ImageTaskParams, ViewPort } from './interface';

@Injectable()
export class PuppeteerService {
  constructor(
    private readonly scheduler: SchedulerRegistry,
    @Inject('puppeteer-cluster') private readonly cluster: Cluster,
  ) {}

  async runPDFTask(params: PDFTaskParams): Promise<Buffer> {
    return this.cluster.execute(params, this.taskPdf);
  }

  async runImageTask(params: ImageTaskParams): Promise<string | Buffer> {
    return this.cluster.execute(params, this.taskImage);
  }

  private async taskPdf({
    page,
    data: { url, viewport, mediaType, timeout, options },
  }: {
    page: Page;
    data: PDFTaskParams;
  }): Promise<Buffer> {
    Logger.log('进入taskPdf' + url);
    if (timeout) {
      await page.setDefaultNavigationTimeout(timeout);
    }
    if (viewport) {
      await page.setViewport(viewport);
    }
    if (mediaType) {
      await page.emulateMediaType(mediaType);
    }
    await page.goto(url, { waitUntil: 'networkidle2' });
    Logger.log('进入页面' + url);
    return page.pdf(options);
  }

  private async taskImage({
    page,
    data: { url, viewport, mediaType, timeout, options },
  }: {
    page: Page;
    data: ImageTaskParams;
  }): Promise<string | Buffer> {
    if (timeout) {
      await page.setDefaultNavigationTimeout(timeout);
    }
    if (viewport) {
      await page.setViewport(viewport);
    }
    if (mediaType) {
      await page.emulateMediaType(mediaType);
    }
    Logger.log('进入页面' + url);
    await page.goto(url, { waitUntil: 'networkidle2' });
    return page.screenshot(options);
  }

  @Interval('idle', 10000)
  async idle() {
    // await this.cluster.idle();
    // await this.cluster.close();
  }
}
