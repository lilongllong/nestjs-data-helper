import {
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import CommonDTO from './common-page.dto';
import { Type } from 'class-transformer';

enum Encodeing {
  BASE64 = 'base64',
  BINARY = 'binary',
}

class ScreenShotOptionsDTO {
  @IsString()
  @IsOptional()
  type: 'png' | 'jpeg' | 'webp';

  @IsEnum(Encodeing)
  @IsOptional()
  encoding: Encodeing;
}

export default class ScreenshotDTO extends CommonDTO {
  @IsObject()
  @ValidateNested()
  @Type(() => ScreenShotOptionsDTO)
  @IsOptional()
  readonly options: ScreenShotOptionsDTO;
}
