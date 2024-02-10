import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwtPayload.interface';
import { ServiceError, ServiceErrorKey } from 'src/shared/errors/service.error';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from './entities/refreshToken.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async createToken(payload: JwtPayload): Promise<string> {
    return await this.jwtService.signAsync(payload, { expiresIn: '1h' });
  }

  async register(createUserDto: RegisterDto): Promise<User> {
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

  async login(loginUserDto: LoginDto): Promise<string> {
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

    return this.createToken(payload);
  }
}
