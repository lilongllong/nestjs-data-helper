import { Controller, Get, Query } from '@nestjs/common';
import { NominalPriceDto } from './dto/nominal-price.dto';
import { XingzhoushenfangService } from './xingzhoushenfang.service';

@Controller('xingzhoushenfang')
export class XingzhoushenfangController {
  constructor(
    private readonly xingzhoushenfangService: XingzhoushenfangService,
  ) {}
  @Get('sunpan/get')
  async getSunpan(
    @Query() query: { name: string },
  ): Promise<{ code: number; data: any }> {
    // 获得笋盘
    const sales = await this.xingzhoushenfangService.querySalesDb({
      name: query.name,
    });
    const prices = await this.xingzhoushenfangService.queryNominalPriceDb({
      estate: query.name,
    });
    return {
      code: 0,
      data: { sales, prices },
    };
  }
  @Get('community/get')
  async getCommunityName(
    @Query() query: { district?: string },
  ): Promise<{ code: number; data: any }> {
    // 获得笋盘
    const communityNames =
      await this.xingzhoushenfangService.queryCommunitySalesDataAll({
        district: query.district,
      });
    return {
      code: 0,
      data: communityNames,
    };
  }
  @Get('job/nominal_price')
  async startNominalPriceScheduleJob() {
    this.xingzhoushenfangService.updateAllNominalPriceScheduleJob();
    return {
      code: 0,
      message: '成功启动抓取房价的脚本任务',
    };
  }
  @Get('job/sales_price')
  async startSalesPriceScheduleJob() {
    this.xingzhoushenfangService.updateAllNominalPriceScheduleJob();
    return {
      code: 0,
      message: '成功启动抓取房价的脚本任务',
    };
  }
}
