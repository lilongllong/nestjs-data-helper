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
  UsePipes,
  ParseIntPipe,
} from '@nestjs/common';
import { Request, Response as ResponseType } from 'express';
import { CatsCreateDto } from './dto/cats.dto';
import { CatsService } from './cats.service';
import { HomeService } from '../home/home.service';
import { ForbiddenException } from '../../exceptions/forbidden.exception';
import { HttpExceptionFilter } from '../../filters/http-exception.filter';
import { TimeValidationPipe } from '../../pipes/time.validation.pipe';
import { Cat, ICat } from './schema/cat.schema';
// import { JoiValidationPipe } from '../pipes/joi.validationPipe';

@Controller('cats')
export class CatsController {
  constructor(
    private catService: CatsService,
    private homeService: HomeService,
  ) {}

  @Post('create')
  @Header('Cache-Control', 'none')
  // @UsePipes(new JoiValidationPipe(createCatSchema))
  async create(
    @Body(new TimeValidationPipe()) body: CatsCreateDto,
  ): Promise<string> {
    await this.catService.create(body);
    return 'this action creates a new cat';
  }

  @Get('findAll')
  async findAll(@Query('id', ParseIntPipe) id: number): Promise<Cat[]> {
    const res = await this.catService.findAll();
    return res;
  }

  @Get('triggerCat')
  async triggerCat(): Promise<Cat[]> {
    const data = await this.catService.createParentCat({
      name: '李隆隆',
      sex: 'male',
      metaData: { firstName: 'Li', lastName: 'LongLong' },
    });
    await this.catService.insertChildCat(
      {
        name: '李南希',
        sex: 'female',
        metaData: { firstName: 'Li', lastName: 'NaXi' },
        children: [],
      },
      data.id,
    );
    const res = await this.catService.findAll();
    return res;
  }

  @Get('findOne/:id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<{
    retcode: number;
    msg: string;
    data: { id: number; age: number; name: string };
  }> {
    const text = this.homeService.getHello();
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
