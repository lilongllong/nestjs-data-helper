import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
  IsOptional,
} from 'class-validator';

class ViewPortDTO {
  @IsInt()
  readonly width: number;

  @IsInt()
  readonly height: number;
}

export default class CommonDTO {
  @IsNotEmpty()
  @IsString()
  readonly url: string;

  @IsObject()
  @ValidateNested()
  @Type(() => ViewPortDTO)
  @IsOptional()
  readonly viewport: ViewPortDTO;

  @IsString()
  @IsOptional()
  mediaType: string;
}
