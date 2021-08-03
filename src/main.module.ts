import { Module } from '@nestjs/common';
import { AppModule } from './app/app.module';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [AppModule, CatsModule],
  controllers: [],
  providers: [],
})
export class MainModule {}
