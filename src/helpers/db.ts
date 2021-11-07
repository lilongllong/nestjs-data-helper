/*
 * 数据库模块
 * @Author: daguolin
 * @Date: 2021-07-21 14:48:19
 * @Last Modified by: daguolin
 * @Last Modified time: 2021-07-27 21:52:54
 */

import { TypeOrmModule } from '@nestjs/typeorm';
import { getConfig } from './config';

export default async () => {
  const config = await getConfig();
  const dbCommon = {
    host: config.db.host,
    port: config.db.port,
    username: config.db.username,
    password: config.db.password,
    database: config.db.database,
  };

  return TypeOrmModule.forRoot({
    type: 'mysql',
    entities: [],
    synchronize: true,
    ...dbCommon,
  });
};
