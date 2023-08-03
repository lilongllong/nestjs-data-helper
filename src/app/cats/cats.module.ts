import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { HomeModule } from '../home/home.module';
import { Cat, CatSchema } from './schema/cat.schema';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
  imports: [
    MongooseModule.forFeature(
      [{ name: Cat.name, schema: CatSchema }],
      // 'nest_data',
    ),
    HomeModule,
  ],
})
export class CatsModule {}
