import { Controller, Get, Post, Header, Param, Body } from '@nestjs/common';
import { Request, Response as ResponseType } from 'express';
import { CatsCreateDto } from './dto/cats.dto';
import { CatsService } from './cats.service';
import { ICat } from './interfaces/cats.interface';

@Controller('cats')
export class CatsController {
  constructor(private catService: CatsService) {}

  @Post('create')
  @Header('Cache-Control', 'none')
  async create(@Body() body: CatsCreateDto): Promise<string> {
    await this.catService.create(body);
    return 'this action creates a new cat';
  }

  @Get('findAll')
  findAll(): ICat[] {
    return this.catService.findAll();
  }

  @Get('findOne/:id')
  async findOne(@Param('id') id): Promise<{
    retcode: number;
    data: { id: number; age: number; name: string };
  }> {
    return {
      retcode: 0,
      data: {
        id: id,
        name: '王亚丽',
        age: 10,
      },
    };
  }
}
