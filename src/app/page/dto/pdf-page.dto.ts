import {
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PaperFormat } from 'puppeteer';

import CommonDTO from './common-page.dto';
import { Type } from 'class-transformer';

class PDFOptionsDTO {
  @IsString()
  @IsOptional()
  format: PaperFormat;
}

export default class PDFDTO extends CommonDTO {
  @IsObject()
  @ValidateNested()
  @Type(() => PDFOptionsDTO)
  @IsOptional()
  readonly options: PDFOptionsDTO;
}
