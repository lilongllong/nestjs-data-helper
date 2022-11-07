import { Controller, Get } from '@nestjs/common';
import { NominalPriceDto } from './dto/nominal-price.dto';
import { XingzhoushenfangService } from './xingzhoushenfang.service';

@Controller('xingzhoushenfang')
export class XingzhoushenfangController {
  constructor(
    private readonly xingzhoushenfangService: XingzhoushenfangService,
  ) {}
  @Get('sunpan/get')
  async getSunpan(): Promise<NominalPriceDto[]> {
    // 获得笋盘
    return [];
  }
}
