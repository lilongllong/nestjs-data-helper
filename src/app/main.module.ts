import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import * as path from 'path';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { HomeModule } from './home/home.module';
import { CatsModule } from './cats/cats.module';
import { UsersModule } from './users/users.module';
import { LightHouseModule } from './lighthouse/lighthouse.module';
import { XingzhoushenfangModule } from './xingzhoushenfang/xingzhoushenfang.module';
import { CatsLoggerMiddleware } from '../middleware/catsLogger.middleware';
import { LoggerMiddleware } from '../middleware/logger.middleware';
import { PageModule } from './page/page.module';
import { PuppeteerModule } from './puppeteer/puppeteer.module';

@Module({
  imports: [
    // 定时器模块
    ScheduleModule.forRoot(),
    // 配置模块
    ConfigModule.forRoot({
      // 全局注入配置
      isGlobal: true,
    }),
    // 数据库ORM模块
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const host = configService.get('MYSQL_HOST');
        const port = configService.get('MYSQL_PORT');
        const username = configService.get('MYSQL_USERNAME');
        const password = configService.get('MYSQL_PASSWORD');
        const database = configService.get('MYSQL_DATABASE');
        console.log(configService.get('MYSQL'), database, '数据库初始化');
        return {
          type: 'mysql',
          host,
          port,
          username,
          password,
          database,
          // 全局注入是实体
          entities: [path.resolve(__dirname, './**/entity/*.entity{.ts,.js}')],
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
    HomeModule,
    CatsModule,
    UsersModule,
    XingzhoushenfangModule,
    LightHouseModule,
    // PuppeteerModule,
    PageModule,
    MongooseModule.forRootAsync({
      useFactory: (cfg: ConfigService) => ({
        uri: cfg.get('MONGO_URL'),
      }),
      inject: [ConfigService],
    }),
    // MongooseModule.forRoot('mongodb://127.0.0.1:27017/nest-data', {
    //   /** multi connect for mongodb */
    //   // connectionName: 'nest_data',
    // }),
  ],
  controllers: [],
  providers: [],
})
export class MainModule implements NestModule {
  constructor(private connection: Connection) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CatsLoggerMiddleware)
      .exclude(
        { path: 'cats/find', method: RequestMethod.GET },
        { path: 'cats/find', method: RequestMethod.POST },
      )
      .forRoutes({ path: 'cats', method: RequestMethod.ALL });

    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
