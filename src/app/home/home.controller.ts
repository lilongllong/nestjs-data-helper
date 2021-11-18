import { Controller, Get } from '@nestjs/common';
import { HomeService } from './home.service';

@Controller()
export class HomeController {
  constructor(private readonly HomeService: HomeService) {}

  @Get()
  getHello(): string {
    return this.HomeService.getHello();
  }
}
