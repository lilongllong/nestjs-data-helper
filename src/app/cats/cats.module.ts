import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { AppModule } from '../app.module';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
  imports: [AppModule],
})
export class CatsModule {}
