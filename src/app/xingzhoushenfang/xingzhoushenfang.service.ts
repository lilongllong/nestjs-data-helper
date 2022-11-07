import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';

import { NominalPriceDB, CommunityDB } from './entity/nominal-price.entity';
import { getStaredEstateData, getAllEstates } from './apis/index';
import { NominalPriceDto, CommunityDto } from './dto/nominal-price.dto';
import { doesNotMatch } from 'assert';

@Injectable()
export class XingzhoushenfangService {
  constructor(
    @InjectRepository(NominalPriceDB)
    private NominalPriceDb: Repository<NominalPriceDB>,
    @InjectRepository(CommunityDB)
    private communityDb: Repository<CommunityDB>,
    private connection: Connection,
  ) {}
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
    console.log(data, 'data');
    const result = await this.createCommunityDb(data);
    return result;
  }
}
