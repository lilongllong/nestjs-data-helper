import {
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { PageService } from './page.service';
import { Response } from 'express';
import ScreenshotDTO from './dto/screenshot-page.dto';
import PDFDTO from './dto/pdf-page.dto';

@Controller('page')
export class PageCongtroller {
  constructor(private readonly pageService: PageService) {}

  @Post('/screenshot')
  @HttpCode(200)
  async screenshot(@Res() response: Response, @Body() params: ScreenshotDTO) {
    Logger.log('screenshot start', JSON.stringify(params));
    const buffer = await this.pageService.screenshot(params);

    response.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename=screenshot_${Date.now()}.png`,
    });
    response.end(buffer);
  }

  @Get('/screenshot_link')
  @HttpCode(200)
  async linkScreenshot(
    @Res() response: Response,
    @Query() params: ScreenshotDTO,
  ) {
    Logger.log('screenshot start', JSON.stringify(params));
    const buffer = await this.pageService.screenshot(params);

    response.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename=screenshot_${Date.now()}.png`,
    });
    response.end(buffer);
  }

  @Post('/pdf')
  @HttpCode(200)
  async pdf(@Res() response: Response, @Body() params: PDFDTO) {
    Logger.log('pdf start');
    const buffer = await this.pageService.pdf(params);
    response.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename=screenshot_${Date.now()}.pdf`,
    });
    response.end(buffer);
  }
  /**
   * @description: 直接使用a链接即可，不要使用axios，axios默认进行json处理会导致格式不对
   */
  @Get('/pdf_link')
  @HttpCode(200)
  async LinkPdf(@Res() response: Response, @Query() params: PDFDTO) {
    Logger.log('pdf start', JSON.stringify(params));
    const buffer = await this.pageService.pdf(params);
    response.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename=screenshot_${Date.now()}.pdf`,
    });
    response.end(buffer);
  }
}
