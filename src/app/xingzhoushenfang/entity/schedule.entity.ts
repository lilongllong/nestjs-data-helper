import {
  Entity,
  EntityOptions,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';

// 脚本计数数据库
@Entity()
export class ScheduleMarkDB {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    type: 'text',
  })
  desc: string; // 标记描述
  @Column({
    type: 'text',
  })
  name: string;
  @Column({
    type: 'text',
  })
  mark: string;
  @Column({
    type: 'float',
    default: 0,
  })
  process: number;
  @UpdateDateColumn()
  updateTime: Date;
}
