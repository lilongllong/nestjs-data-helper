import {
  Entity,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  ObjectID,
} from 'typeorm';

@Entity()
export class SalesMongoDB {
  @ObjectIdColumn()
  id: ObjectID;
  @Column({
    default: 0,
  })
  ref_id: number;
  @Column({
    type: 'text',
  })
  area: string;
  @Column({
    type: 'text',
  })
  district: string;
  @Column({
    type: 'text',
  })
  name: string;
  @Column({
    type: 'int',
  })
  roomCount: number;
  @Column({
    default: 0,
    type: 'float',
  })
  acreage: number;
  @Column({
    default: 0,
    type: 'float',
  })
  price: number;
  @Column({
    default: 0,
    type: 'float',
  })
  cycle: number;
  @Column({
    type: 'text',
  })
  date: string;
  @Column({
    default: 0,
    type: 'float',
  })
  unitPrice: number;
  @Column({
    type: 'text',
  })
  site: string;
  @CreateDateColumn()
  createTime: Date;
}
