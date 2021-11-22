import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { HomeModule } from '../home/home.module';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
  imports: [HomeModule],
})
export class CatsModule {}
