import { TypeOrmModule } from '@nestjs/typeorm';
import { getConfig } from './config';

export default async () => {
  const config = await getConfig();
  const dbCommon = {
    host: config.mongodb.host,
    port: config.mongodb.port,
    username: config.mongodb.username,
    password: config.mongodb.password,
    database: config.mongodb.database,
  };

  return TypeOrmModule.forRoot({
    type: 'mongodb',
    name: 'mongoConnection',
    ...dbCommon,
  });
};
