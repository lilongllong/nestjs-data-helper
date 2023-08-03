import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Cat, CatDocument, ICat } from './schema/cat.schema';
import { InjectModel, Schema as schema } from '@nestjs/mongoose';
import { CatsCreateDto } from './dto/cats.dto';

const CATS_PREFIX = 'CAT';

@Injectable()
export class CatsService {
  private readonly cats: any[] = [];
  @InjectModel(Cat.name)
  private readonly catModel: Model<Cat>;
  @InjectConnection()
  private readonly connection: Connection;
  async create(cat: any) {
    this.cats.push(cat);
  }
  async findAll(): Promise<Cat[]> {
    const data = await this.catModel.find().exec();
    return data;
  }
  async insertChildCat(cat: CatsCreateDto, id: string): Promise<Cat> {
    const child = new this.catModel({
      name: cat.name,
      sex: cat.sex,
      metaData: cat.metaData,
      children: cat.children || [],
      updated: Date.now(),
    });
    await child.save();
    const data = await this.catModel.findOne({ id }).exec();
    if (data) {
      data.children.push(child.id);
    }
    return await data.save();
  }
  async insertChildCatCollection(cat: CatsCreateDto, id: string): Promise<any> {
    return this.connection
      .collection(`${CATS_PREFIX}_${id}`, {
        storageEngine: {
          wiredTiger: { configString: 'block_compressor=zlib' },
        },
      })
      .insertOne({
        name: cat.name,
        sex: cat.sex,
        metaData: cat.metaData,
        children: cat.children || [],
        updated: Date.now(),
      });
  }
  async createParentCat(cat: CatsCreateDto): Promise<Cat> {
    const createCat = new this.catModel({
      name: cat.name,
      sex: cat.sex,
      metaData: cat.metaData,
      children: cat.children || [],
      updated: Date.now(),
    });
    return createCat.save();
  }
  async resetCats() {
    return await this.catModel.deleteMany({});
  }
}
