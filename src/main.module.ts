import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { Module } from '@nestjs/common';
import { AppModule } from './app/app.module';
import { CatsModule } from './cats/cats.module';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AppModule,
    CatsModule,
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
      entities: [User],
      synchronize: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class MainModule {
  constructor(private connection: Connection) {}
}
