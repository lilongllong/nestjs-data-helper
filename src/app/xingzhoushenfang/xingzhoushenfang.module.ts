import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  NominalPriceDB,
  CommunityDB,
  SalesDB,
} from './entity/nominal-price.entity';
import { SalesMongoDB } from './entity/norminal-price.mongoEntity';
import { XingzhoushenfangService } from './xingzhoushenfang.service';
import { NominalPriceSubscriber } from './subscribers/nominal-price.subscriber';
import { XingzhoushenfangController } from './xingzhoushenfang.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([NominalPriceDB, CommunityDB, SalesDB]),
    TypeOrmModule.forFeature([SalesMongoDB], 'mongoConnection'),
  ],
  providers: [XingzhoushenfangService, NominalPriceSubscriber],
  controllers: [XingzhoushenfangController],
  exports: [XingzhoushenfangService],
})
export class XingzhoushenfangModule {}
