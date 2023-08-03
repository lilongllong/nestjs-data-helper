import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Cat, CatDocument, ICat } from './schema/cat.schema';
import { InjectModel, Schema as schema } from '@nestjs/mongoose';
import { CatsCreateDto } from './dto/cats.dto';
import { Type } from 'class-transformer';

@Injectable()
export class CatsService {
  private readonly cats: any[] = [];
  @InjectModel(Cat.name)
  private readonly catModel: Model<Cat>;
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
}
