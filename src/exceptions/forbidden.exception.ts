/**
 * @description: 自定义拒绝访问的Exceptions的Error
 */
import { HttpException, HttpStatus } from '@nestjs/common';

export class ForbiddenException extends HttpException {
  constructor() {
    super('Custom Forbidden', HttpStatus.FORBIDDEN);
  }
}
