import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersDto, ResDto } from './dto/users.dto';
import { AuthGuard } from '../guards/auth.guards';

@Controller('users')
@UseGuards(new AuthGuard())
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  async createUser(@Body() body: UsersDto): Promise<ResDto> {
    const res = await this.usersService.add(body);
    return {
      retcode: 0,
      data: res,
      msg: '',
    };
  }
  @Get('find')
  async find(): Promise<ResDto> {
    const res = await this.usersService.findAll();
    return {
      retcode: 0,
      data: res,
      msg: '',
    };
  }
}
