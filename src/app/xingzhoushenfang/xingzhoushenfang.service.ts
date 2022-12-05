import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';

import {
  NominalPriceDB,
  CommunityDB,
  SalesDB,
} from './entity/nominal-price.entity';
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
} from './dto/nominal-price.dto';
import { formatCommunityName } from 'src/utils/index';

@Injectable()
export class XingzhoushenfangService {
  constructor(
    @InjectRepository(NominalPriceDB)
    private NominalPriceDb: Repository<NominalPriceDB>,
    @InjectRepository(CommunityDB)
    private communityDb: Repository<CommunityDB>,
    @InjectRepository(SalesDB)
    private salesDb: Repository<SalesDB>,
    private connection: Connection,
  ) {}
  async querySalesDb(params: any) {
    const data = await this.salesDb.find(params);
    return data;
  }
  async queryNominalPriceDb(params: any) {
    const data = await this.NominalPriceDb.find(params);
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
        const oldData = await this.salesDb.findOne({ ref_id: item.ref_id });
        if (oldData) {
          continue;
        }
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
  async queryNominalPriceData() {
    const data = await getStaredEstateData();
    const formatData = data.reduce((target, curr) => [...target, ...curr]);
    const result = await this.createMany(formatData);
    return result;
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
  async queryCommunityFromDb(params = {}): Promise<[CommunityDB[], number]> {
    try {
      const data = await this.communityDb.findAndCount(params);
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
    for (
      let index = Math.max(communityNames.indexOf('****'), 0);
      index < communityNames.length;
      index++
    ) {
      const res = await getSalesPriceItem({ keyWord: communityNames[index] });
      await this.createManySaleDB(res);
      console.log(communityNames[index], res);
    }
    console.log('脚本执行完毕');
  }
  async tempSalesUpdate() {
    const res = await getSalesPriceItem({ keyWord: '万象新天' });
    await this.createManySaleDB(res);
    console.log(res, 'res');
  }
}
