import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ServiceError, ServiceErrorKey } from 'src/shared/errors/service.error';
import { RegisterDto } from '../auth/dto/register.dto';
import { Relationship } from './entities/relationship.entity';

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

  async findOne(email?: string, username?: string): Promise<User> {
    return this.userRepository.findOne({
      where: [{ email }, { username }],
    });
  }

  async create(createUserDto: RegisterDto): Promise<User> {
    return this.userRepository.save({
      ...createUserDto,
    });
  }

  async follow(followerId: string, followedId: string) {
    const follower = await this.findOneById(followerId);
    const followed = await this.findOneById(followedId);

    if (!follower || !followed) {
      throw new ServiceError(ServiceErrorKey.NotFound);
    }

    const relationship = new Relationship();
    relationship.follower = follower;
    relationship.followed = followed;

    follower.following.push(relationship);

    await this.userRepository.save(follower);
  }

  async getFollowers(userId: string) {
    
  }
}
