import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository, Like } from 'typeorm';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection as MongoConnect, Types } from 'mongoose';
import { SessionDocument } from './entity/session.schema';
import SessionDTO from './dto/session.dto';

import {
  NominalPriceDB,
  CommunityDB,
  SalesDB,
} from './entity/nominal-price.entity';
import { ScheduleMarkDB } from './entity/schedule.entity';
import {
  getStaredEstateData,
  getAllEstates,
  getNominalPriceItem,
  getSalesPriceItem,
} from './apis/index';
import {
  NominalPriceDto,
  CommunityDto,
  SalesDto,
  ScheduleMarkDto,
} from './dto/nominal-price.dto';
import { formatCommunityName } from 'src/utils/index';

import { HOUSE_VARIABLES, IGNORE_COMMUNITY } from './constants/index';

@Injectable()
export class XingzhoushenfangService {
  constructor(
    @InjectModel('Session')
    private readonly session: Model<SessionDocument>,
    @InjectConnection()
    private readonly mongoConnection: MongoConnect,
    @InjectRepository(NominalPriceDB)
    private NominalPriceDb: Repository<NominalPriceDB>,
    @InjectRepository(CommunityDB)
    private communityDb: Repository<CommunityDB>,
    @InjectRepository(SalesDB)
    private salesDb: Repository<SalesDB>,
    @InjectRepository(ScheduleMarkDB)
    private scheduleMarkDb: Repository<ScheduleMarkDto>,
    private connection: Connection,
  ) {}
  async createSession(sessionDTO: SessionDTO) {
    const sessionEntity = await this.session.create(sessionDTO);
    return { sessionId: sessionEntity?._id };
  }
  async getSessions() {
    return this.mongoConnection
      .collection('sessions')
      .find({})
      .sort({ timestamp: -1 })
      .toArray();
  }
  async querySalesDb(params: any) {
    const data = await this.salesDb.find({ where: params });
    return data;
  }
  async queryNominalPriceDb(params: any) {
    const data = await this.NominalPriceDb.find({ where: params });
    return data;
  }
  async createMany(prices: NominalPriceDto[]) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (let index = 0; index < prices.length; index++) {
        const item = prices[index];
        const db = new NominalPriceDB();
        db.refPrice = item.refPrice || 0;
        db.acreage = item.acreage || 0;
        db.changeDay = item.changeDay || '';
        db.changePrice = item.changePrice || 0;
        db.changeRate = item.changeRate || 0;
        db.changeType = item.changeType || '';
        db.estate = item.estate || '';
        db.houseId = item.houseId || '';
        db.layout = item.layout || '';
        db.orientation = item.orientation || '';
        db.originalUrl = item.originalUrl || '';
        db.price = item.price || 0;
        db.refScale = item.refScale || 0;
        db.site = item.site || '';
        db.tags = item.tags || '';
        db.title = item.title || '';
        db.unitPrice = item.unitPrice || 0;
        db.ref_id = item.ref_id || 0;
        await queryRunner.manager.save(db);
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      console.log(error, 'error');
      await queryRunner.rollbackTransaction();
      return false;
    } finally {
      await queryRunner.release();
    }
    return true;
  }
  async createManySaleDB(prices: SalesDto[]) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (let index = 0; index < prices.length; index++) {
        const item = prices[index];
        const oldData = await this.salesDb.findOne({
          where: {
            ref_id: item.ref_id,
          },
        });
        if (oldData) {
          continue;
        }
        console.log('插入', prices);
        const db = new SalesDB();
        db.acreage = item.acreage || 0;
        db.area = item.area || '';
        db.cycle = item.cycle || 0;
        db.roomCount = item.roomCount || 0;
        db.date = item.date || '';
        db.district = item.district || '';
        db.name = item.name || '';
        db.price = item.price || 0;
        db.site = item.site || '';
        db.unitPrice = item.unitPrice || 0;
        db.ref_id = item.ref_id || 0;
        await queryRunner.manager.save(db);
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      console.log(error, 'error');
      await queryRunner.rollbackTransaction();
      return false;
    } finally {
      await queryRunner.release();
    }
    return true;
  }
  async querySaleDistrictName() {
    return this.salesDb
      .createQueryBuilder()
      .select('DISTINCT district', 'district')
      .getMany();
  }
  async queryNominalPriceData() {
    const data = await getStaredEstateData();
    const formatData = data.reduce((target, curr) => [...target, ...curr]);
    const result = await this.createMany(formatData);
    return result;
  }
  async updateScheduleMark(value: Partial<ScheduleMarkDto>) {
    const existRes = await this.scheduleMarkDb.findOne({
      where: {
        name: value.name,
      },
    });
    if (existRes) {
      const res = await this.scheduleMarkDb
        .createQueryBuilder()
        .update(ScheduleMarkDB)
        .set({ mark: value.mark, process: value.process })
        .where('id = :id', { id: existRes.id })
        .execute();
      return res;
    } else {
      const scheduleMarkIns = new ScheduleMarkDB();
      scheduleMarkIns.desc = value.desc || '';
      scheduleMarkIns.mark = value.mark || '';
      scheduleMarkIns.name = value.name || '';
      scheduleMarkIns.process = value.process || 0;
      const res = await this.scheduleMarkDb
        .createQueryBuilder()
        .insert()
        .values(scheduleMarkIns)
        .execute();
      return res;
    }
  }
  async createCommunityDb(communities: CommunityDto[]) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (let index = 0; index < communities.length; index++) {
        const item = communities[index];
        const db = new CommunityDB();
        db.communityName = item.communityName || '';
        db.zoneName = item.zoneName || '';
        db.districtname = item.districtname || '';
        await queryRunner.manager.save(db);
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      console.log(error, 'error');
      await queryRunner.rollbackTransaction();
      return false;
    } finally {
      await queryRunner.release();
    }
    return true;
  }
  async queryCommunityData() {
    const data = await getAllEstates();
    const result = await this.createCommunityDb(data);
    return result;
  }
  async queryCommunitySalesData(
    value: { name: string },
    options?: { findOne: boolean },
  ) {
    if (options?.findOne) {
      return this.salesDb.findOne({
        where: {
          name: value.name,
        },
      });
    } else {
      return this.salesDb.findAndCount({
        where: {
          name: value.name,
        },
      });
    }
  }
  async queryCommunitySalesDataAll(value: { district?: string }) {
    return this.salesDb
      .createQueryBuilder()
      .select('DISTINCT name', 'name')
      .getRawMany();
  }
  async queryCommunityFromDb(params = {}): Promise<[CommunityDB[], number]> {
    try {
      const data = await this.communityDb.findAndCount({ where: params });
      return data;
    } catch (error) {
      console.log(error, 'error');
      return [[], 0];
    }
  }
  async updateAllNominalPriceScheduleJob() {
    const data: [CommunityDB[], number] = await this.queryCommunityFromDb();
    const communityNames = data[0].map((item) =>
      formatCommunityName(item.communityName),
    );
    for (let index = 0; index < communityNames.length; index++) {
      const res = await getNominalPriceItem({ keyWord: communityNames[index] });
      await this.createMany(res);
      console.log(communityNames[index], res);
    }
  }
  async updateAllSalesPriceScheduleJob() {
    const data: [CommunityDB[], number] = await this.queryCommunityFromDb();
    const communityNames = data[0]
      .map((item) => formatCommunityName(item.communityName))
      .reduce((target, curr) => {
        if (!target.includes(curr)) {
          target.push(curr);
        }
        return target;
      }, []);
    const markRes = await this.scheduleMarkDb.findOne({
      where: {
        name: HOUSE_VARIABLES.xingzhoushenfang.name,
      },
    });
    for (
      let index = Math.max(communityNames.indexOf(markRes?.mark), 0);
      index < communityNames.length;
      index++
    ) {
      if (IGNORE_COMMUNITY.includes(communityNames[index])) {
        continue;
      }
      // 首先进行查询，非热门小区不进行调整
      const hasRes = await this.queryCommunitySalesData(
        { name: communityNames[index] },
        { findOne: true },
      );
      if (hasRes) {
        const res = await getSalesPriceItem({ keyWord: communityNames[index] });
        if (res?.length > 0) {
          await this.createManySaleDB(res);
          await this.updateScheduleMark({
            ...HOUSE_VARIABLES.xingzhoushenfang,
            process: Number(
              (((index + 1) / communityNames.length) * 100).toFixed(2),
            ),
            mark: communityNames[index],
          });
          console.log(communityNames[index], res);
        } else {
          console.log(communityNames[index], '被拦截, 中断后续请求');
          break;
        }
      } else {
        console.log(communityNames[index], '低频小区');
      }
    }
    console.log('脚本执行完毕');
  }
  async tempSalesUpdate() {
    const res = await getSalesPriceItem({ keyWord: '万象新天' });
    await this.createManySaleDB(res);
    // console.log(res, 'res');
  }
}
