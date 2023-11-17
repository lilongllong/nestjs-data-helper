import { Module } from '@nestjs/common';

import { PuppeteerModule } from '../puppeteer/puppeteer.module';
import { PageCongtroller } from './page.controller';
import { PageService } from './page.service';

@Module({
  imports: [PuppeteerModule.register()],
  providers: [PageService],
  controllers: [PageCongtroller],
})
export class PageModule {}
