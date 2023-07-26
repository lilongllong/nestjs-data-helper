import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { NominalPriceDto, IHttpRes } from './dto/nominal-price.dto';
import { XingzhoushenfangService } from './xingzhoushenfang.service';
import { Like, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

function isEmpty(value: any) {
  if (value !== undefined && value !== null && value !== '') {
    return false;
  }
  return true;
}

@Controller('xingzhoushenfang')
export class XingzhoushenfangController {
  constructor(
    private readonly xingzhoushenfangService: XingzhoushenfangService,
  ) {}
  @Get('price/get')
  async getPriceFromMongodb() {
    await this.xingzhoushenfangService.createSession({});
    const data = await this.xingzhoushenfangService.getSessions();
    return { code: 0, data };
  }
  @Get('sunpan/get')
  async getSunpan(@Query() query: { name: string }): Promise<IHttpRes<any>> {
    // 获得笋盘
    const sales = await this.xingzhoushenfangService.querySalesDb({
      name: Like(`%${query.name}%`),
    });
    const prices = await this.xingzhoushenfangService.queryNominalPriceDb({
      estate: Like(`%${query.name}%`),
    });
    return {
      code: 0,
      data: { sales, prices },
    };
  }
  @Get('community/get')
  async getCommunityName(
    @Query() query: { district?: string },
  ): Promise<IHttpRes<any>> {
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
  @Post('sales/filter')
  async getSalesByFilterParams(
    @Body()
    body: {
      price?: number[];
      acreage?: number[];
      roomCount?: number[];
      unitPrice?: number[];
      district?: string;
    },
  ): Promise<{ code: number; data: any }> {
    const formatValueParams = (params, key, queryParams) => {
      if (params[key] && Array.isArray(params[key]) && params[key].length > 0) {
        if (!isEmpty(params[key]?.[0]) && !isEmpty(params[key]?.[1])) {
          queryParams[key] = Between(params[key][0], params[key][1]);
        } else if (!isEmpty(params[key]?.[0]) && isEmpty(params[key]?.[1])) {
          // > 检索
          queryParams[key] = MoreThanOrEqual(params[key][0]);
        } else if (isEmpty(params[key]?.[0]) && !isEmpty(params[key]?.[1])) {
          queryParams[key] = LessThanOrEqual(params[key][1]);
        }
      }
    };
    // 对售卖价格进行拆分
    const queryParams: any = {};
    if (body.district) {
      queryParams.district = body.district;
    }
    formatValueParams(body, 'acreage', queryParams);
    formatValueParams(body, 'price', queryParams);
    formatValueParams(body, 'roomCount', queryParams);
    formatValueParams(body, 'unitPrice', queryParams);
    const data = await this.xingzhoushenfangService.querySalesDb(queryParams);
    return {
      code: 0,
      data,
    };
  }
  @Get('district/get')
  async getDistrictInfo(): Promise<IHttpRes<string[]>> {
    const result = this.xingzhoushenfangService.querySaleDistrictName();
    return {
      code: 0,
      data: (await result).map((item) => item.district),
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
