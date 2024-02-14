import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOneOptions, QueryFailedError, Repository } from 'typeorm';
import { ServiceError, ServiceErrorKey } from 'src/shared/errors/service.error';
import { RegisterDto } from '../auth/dto/register.dto';
import { Relationship } from './entities/relationship.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Relationship)
    private relationshipRepository: Repository<Relationship>,
  ) {}

  private async getFollowUsers(followerId: string, followedId: string) {
    const follower = await this.findOneById(followerId);
    const followed = await this.findOneById(followedId);

    if (!follower || !followed) {
      throw new ServiceError(ServiceErrorKey.NotFound);
    }

    return { follower, followed };
  }

  async findOneById(
    id: string,
    options: FindOneOptions<User> = {},
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      ...options,
    });

    if (!user) {
      throw new ServiceError(ServiceErrorKey.NotFound);
    }

    return user;
  }

  async findOne(email?: string, username?: string): Promise<User> {
    return this.userRepository.findOne({
      where: [{ email }, { username }],
      select: {
        id: true,
        username: true,
        password: true,
      },
    });
  }

  async create(createUserDto: RegisterDto): Promise<User> {
    return this.userRepository.save({
      ...createUserDto,
    });
  }

  async follow(followerId: string, followedId: string): Promise<void> {
    const { follower, followed } = await this.getFollowUsers(
      followerId,
      followedId,
    );
    const relationship = new Relationship();
    relationship.follower = follower;
    relationship.followed = followed;

    try {
      await this.relationshipRepository.save(relationship);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new ServiceError(ServiceErrorKey.AlreadyExists);
      }
    }
  }

  async unFollow(followerId: string, followedId: string): Promise<void> {
    const result = await this.relationshipRepository.delete({
      followedId,
      followerId,
    });

    if (result.affected === 0) {
      throw new ServiceError(ServiceErrorKey.NotFound);
    }
  }

  async getFollowers(userId: string): Promise<Relationship[]> {
    return this.relationshipRepository.find({
      where: {
        followedId: userId,
      },
      relations: {
        followed: true,
      },
      select: {
        followed: {
          id: true,
          username: true,
          fullName: true,
        },
      },
    });
  }

  async getFollowing(userId: string): Promise<Relationship[]> {
    return await this.relationshipRepository.find({
      where: {
        followerId: userId,
      },
      relations: {
        follower: true,
      },
      select: {
        followedId: false,
        followerId: false,
        follower: {
          id: true,
          username: true,
          fullName: true,
        },
      },
    });
  }
}
