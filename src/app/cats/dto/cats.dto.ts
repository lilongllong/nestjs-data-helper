import { IsString, IsInt, IsIn } from 'class-validator';

export class CatsCreateDto {
  @IsInt()
  age: number;

  @IsString()
  name: string;

  @IsIn(['男', '女'])
  sex: '男' | '女';
}
