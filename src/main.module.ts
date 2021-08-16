import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppModule } from './app/app.module';
import { CatsModule } from './cats/cats.module';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { CatsLoggerMiddleware } from './middleware/catsLogger.middleware';
import { LoggerMiddleware } from './middleware/logger.middleware';

@Module({
  imports: [
    AppModule,
    CatsModule,
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '9.134.46.31',
      port: 3306,
      username: 'root',
      password: 'HrXdj!4736xs',
      database: 'nest_demo',
      entities: [User],
      synchronize: true,
    }),
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
