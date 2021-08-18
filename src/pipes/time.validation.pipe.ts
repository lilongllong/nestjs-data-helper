/**
 * 时间格式转化器
 */

import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class TimeValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    console.log(errors, 'error');
    if (errors.length > 0) {
      throw new BadRequestException(
        `Validation Failed ${errors
          .map((error) => error.constraints)
          .join(',')}`,
      );
    }
    return value;
  }

  private toValidate(metatype): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
