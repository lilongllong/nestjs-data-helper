import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class NominalPriceDB {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    default: 0,
  })
  ref_id: number;
  @Column()
  houseId: string;
  @Column()
  title: string;
  @Column()
  layout: string;
  @Column({
    default: 0,
    type: 'float',
  })
  acreage: number; // 面积
  @Column()
  orientation: string;
  @Column()
  estate: string;
  @Column()
  tags: string;
  @Column({
    default: 0,
    type: 'float',
  })
  refPrice: number;
  @Column({
    default: 0,
    type: 'float',
  })
  price: number;
  @Column()
  originalUrl: string;
  @Column()
  site: string;
  @Column({
    default: '',
  })
  data: string; //
  @Column({
    default: 0,
    type: 'float',
  })
  unitPrice: number;
  @Column({
    default: 0,
    type: 'float',
  })
  refScale: number;
  @Column()
  changeType: string;
  @Column({
    default: 0,
    type: 'float',
  })
  changePrice: number; // 加价情况
  @Column({
    default: 0,
    type: 'float',
  })
  changeRate: number;
  @Column()
  changeDay: string;
  @CreateDateColumn()
  createTime: Date;
}

@Entity()
export class CommunityDB {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    type: 'text',
  })
  communityName: string;
  @Column({
    type: 'text',
  })
  districtname: string;
  @Column({
    type: 'text',
  })
  zoneName: string;
  @CreateDateColumn()
  createTime: Date;
}

@Entity()
export class SalesDB {
  @PrimaryGeneratedColumn()
  id: number;
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
