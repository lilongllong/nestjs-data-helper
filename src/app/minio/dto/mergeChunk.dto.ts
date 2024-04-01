import { IsNotEmpty, IsString, IsNumber, IsDate } from 'class-validator';

export default class BlockDTO {
  @IsNotEmpty()
  @IsString()
  readonly fileHash: string;

  @IsNotEmpty()
  @IsNumber()
  readonly size: number;

  @IsNotEmpty()
  @IsString()
  readonly sessionId: string;

  @IsNotEmpty()
  @IsNumber()
  readonly startTimestamp: number;

  @IsNotEmpty()
  @IsNumber()
  readonly endTimestamp: number;
}
