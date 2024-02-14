import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
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

  async follow(followerId: string, followedId: string) {
    const follower = await this.userRepository.findOne({
      where: { id: followerId },
      relations: { following: true },
    });
    const followed = await this.findOneById(followedId);

    if (!follower || !followed) {
      throw new ServiceError(ServiceErrorKey.NotFound);
    }

    const relationship = new Relationship();
    relationship.follower = follower;
    relationship.followed = followed;

    follower.following.push(relationship);

    await this.relationshipRepository.save(relationship);
    await this.userRepository.save(follower);
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
