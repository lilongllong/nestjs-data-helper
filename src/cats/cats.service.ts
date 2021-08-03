import { Injectable } from '@nestjs/common';
import { ICat } from './interfaces/cats.interface';

@Injectable()
export class CatsService {
  private readonly cats: ICat[] = [];
  async create(cat: ICat) {
    this.cats.push(cat);
  }
  findAll(): ICat[] {
    return this.cats;
  }
}
