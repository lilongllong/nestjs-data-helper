import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionSchema } from './entity/session.schema';

import {
  NominalPriceDB,
  CommunityDB,
  SalesDB,
} from './entity/nominal-price.entity';
import { ScheduleMarkDB } from './entity/schedule.entity';
import { XingzhoushenfangService } from './xingzhoushenfang.service';
import { NominalPriceSubscriber } from './subscribers/nominal-price.subscriber';
import { XingzhoushenfangController } from './xingzhoushenfang.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NominalPriceDB,
      CommunityDB,
      SalesDB,
      ScheduleMarkDB,
    ]),
    MongooseModule.forFeature(
      [{ name: 'Session', schema: SessionSchema }],
      // 'nest_data',
    ),
  ],
  providers: [XingzhoushenfangService, NominalPriceSubscriber],
  controllers: [XingzhoushenfangController],
  exports: [XingzhoushenfangService],
})
export class XingzhoushenfangModule {}
