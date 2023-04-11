import { Module } from '@nestjs/common';
import { LightHouseController } from './lighthouse.controller';
import { LightHouseService } from './lighthouse.service';

@Module({
  controllers: [LightHouseController],
  providers: [LightHouseService],
  imports: [],
})
export class LightHouseModule {}
