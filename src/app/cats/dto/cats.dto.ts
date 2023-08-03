import { Type } from 'class-transformer';
import {
  IsString,
  IsInt,
  IsIn,
  isObject,
  ValidateNested,
} from 'class-validator';

export class CatsCreateDto {
  @IsString()
  name: string;

  @IsIn(['male', 'female'])
  sex: 'male' | 'female';

  metaData: {
    firstName: string;
    lastName: string;
  };

  children?: CatsCreateDto[];
}
