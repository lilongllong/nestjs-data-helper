import { Controller, Get, Query, Res } from '@nestjs/common';
import { LightHouseService } from './lighthouse.service';
import { Response } from 'express';

@Controller('lighthouse')
export class LightHouseController {
  constructor(private readonly lightHouseService: LightHouseService) {}
  @Get('query_performance')
  async queryPerformance(
    @Query() query: { url: string },
    @Res() res: Response,
  ) {
    const responseHtml = this.lightHouseService.runLigthTask(
      query.url,
      undefined,
    );
    res.send(responseHtml);
  }
}
