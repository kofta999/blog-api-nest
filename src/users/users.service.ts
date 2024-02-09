import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { ServiceError, ServiceErrorKey } from 'src/errors/service.error';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private authService: AuthService,
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

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    try {
      const user = await this.userRepository.save({
        ...createUserDto,
        password: hashedPassword,
      });
      if (user && user.password) delete user.password;
      return user;
    } catch (e) {
      throw new ServiceError(ServiceErrorKey.AlreadyExists);
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<string> {
    const currentUser = await this.userRepository.findOne({
      where: [
        { email: loginUserDto.email },
        { username: loginUserDto.username },
      ],
    });

    if (!currentUser) {
      throw new ServiceError(ServiceErrorKey.NotFound);
    }

    const isPasswordValid = await bcrypt.compare(
      loginUserDto.password,
      currentUser.password,
    );

    if (!isPasswordValid) {
      throw new ServiceError(ServiceErrorKey.WrongPassword);
    }

    const payload = { sub: currentUser.id, username: currentUser.username };

    return this.authService.createToken(payload);
  }
}
