import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> | null {
    const currentUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
        username: createUserDto.username,
      },
    });

    if (currentUser) {
      return null;
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.userRepository.save({
      ...createUserDto,
      password: hashedPassword,
    });

    if (user && user.password) delete user.password;

    return user;
  }

  async login(
    loginUserDto: LoginUserDto,
  ): Promise<{ accessToken: string | null; error: string | null }> | null {
    const currentUser = await this.userRepository.findOne({
      where: [
        { email: loginUserDto.email },
        { username: loginUserDto.username },
      ],
    });

    if (!currentUser) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(
      loginUserDto.password,
      currentUser.password,
    );

    if (!isPasswordValid) {
      // return ?
      return { accessToken: null, error: 'Password Invalid' };
    }

    // create jwt and return
    const payload = { sub: currentUser.id, username: currentUser.username };

    return {
      accessToken: await this.authService.createToken(payload),
      error: null,
    };
  }
}
