import { IsNotEmpty, IsString } from 'class-validator';
import { IsFile, FileSystemStoredFile } from 'nestjs-form-data';

export default class BlockDTO {
  @IsNotEmpty()
  @IsString()
  readonly fileHash: string;

  @IsNotEmpty()
  @IsString()
  readonly hash: string;

  @IsNotEmpty()
  @IsString()
  readonly sessionId: string;

  @IsFile()
  @IsNotEmpty()
  readonly chunk: FileSystemStoredFile;
}
