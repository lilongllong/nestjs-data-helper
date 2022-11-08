import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  NominalPriceDB,
  CommunityDB,
  SalesDB,
} from './entity/nominal-price.entity';
import { XingzhoushenfangService } from './xingzhoushenfang.service';
import { NominalPriceSubscriber } from './subscribers/nominal-price.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([NominalPriceDB, CommunityDB, SalesDB])],
  providers: [XingzhoushenfangService, NominalPriceSubscriber],
  controllers: [],
  exports: [XingzhoushenfangService],
})
export class XingzhoushenfangModule {}