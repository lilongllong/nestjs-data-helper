import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { UsersDto } from './dto/users.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private connection: Connection,
  ) {}
  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
  findOne(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async add(user: UsersDto): Promise<any> {
    const dbUser = new User();
    dbUser.firstName = user.firstName;
    dbUser.isActive = user.isActive;
    dbUser.lastName = user.lastName;
    return this.userRepository.save(dbUser);
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
  async createMany(users: User[]) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(users[0]);
      await queryRunner.manager.save(users[1]);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
