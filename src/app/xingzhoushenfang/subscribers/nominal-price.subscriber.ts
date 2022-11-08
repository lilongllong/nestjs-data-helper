import {
  Connection,
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
} from 'typeorm';

import { NominalPriceDB } from '../entity/nominal-price.entity';

@EventSubscriber()
export class NominalPriceSubscriber implements EntitySubscriberInterface {
  constructor(connect: Connection) {
    connect.subscribers.push(this);
  }
  listenTo() {
    return NominalPriceDB;
  }
  afterInsert(event: InsertEvent<any>): void | Promise<any> {
    // ** 检查是否为最低价，如果是则进行推送，
    // ** 是否进行大幅度的降价，如果则进行推送
    // console.log(event, '添加时间');
  }
}
