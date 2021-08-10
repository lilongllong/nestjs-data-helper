export class UsersDto {
  id?: number;
  firstName: string;
  lastName: string;
  isActive: boolean;
}

export class ResDto {
  retcode: number;
  data: any;
  msg: string;
}
