import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ServiceError, ServiceErrorKey } from 'src/shared/errors/service.error';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new ServiceError(ServiceErrorKey.NotFound);
    }

    return user;
  }
}
