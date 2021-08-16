import {
  Controller,
  Get,
  Post,
  Header,
  Param,
  Body,
  Query,
  HttpException,
  HttpStatus,
  UseFilters,
} from '@nestjs/common';
import { Request, Response as ResponseType } from 'express';
import { CatsCreateDto } from './dto/cats.dto';
import { CatsService } from './cats.service';
import { ICat } from './interfaces/cats.interface';
import { AppService } from '../app/app.service';
import { ForbiddenException } from '../exceptions/forbidden.exception';
import { HttpExceptionFilter } from '../filters/http-exception.filter';

@Controller('cats')
export class CatsController {
  constructor(
    private catService: CatsService,
    private appService: AppService,
  ) {}

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
    msg: string;
    data: { id: number; age: number; name: string };
  }> {
    const text = this.appService.getHello();
    console.log(text);
    return {
      retcode: 0,
      msg: text,
      data: {
        id: id,
        name: '王亚丽',
        age: 10,
      },
    };
  }

  @Get('httpsError')
  @UseFilters(new HttpExceptionFilter())
  checkErrors(@Query() querry: { errorCode: number }) {
    throw new HttpException(
      {
        status: HttpStatus.FORBIDDEN,
        error: 'This is a custom message',
      },
      HttpStatus.FORBIDDEN,
    );
  }
  @Get('httpsError/forbidden')
  @UseFilters(new HttpExceptionFilter())
  checkForbiddenErrors() {
    throw new ForbiddenException();
  }
}
