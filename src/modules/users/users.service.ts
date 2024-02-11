import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ServiceError, ServiceErrorKey } from 'src/shared/errors/service.error';
import { RegisterDto } from '../auth/dto/register.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findOneById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: {
        refreshTokens: true,
      },
      select: {
        id: true,
        refreshTokens: true,
      },
    });

    if (!user) {
      throw new ServiceError(ServiceErrorKey.NotFound);
    }

    return user;
  }

  async findOne(email?: string, username?: string) {
    return this.userRepository.findOne({
      where: [{ email }, { username }],
    });
  }

  async create(createUserDto: RegisterDto) {
    return this.userRepository.save({
      ...createUserDto,
    });
  }
}
