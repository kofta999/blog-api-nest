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
import keys from 'src/config/keys';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  private async createToken(
    payload: JwtPayload,
    expiresIn: string,
    secret: string,
  ): Promise<string> {
    return this.jwtService.signAsync(payload, { expiresIn, secret });
  }

  private async createAccessToken(payload: JwtPayload): Promise<string> {
    return this.createToken(payload, '1h', keys.jwtModuleConfig.secret);
  }

  private async createRefreshToken(payload: JwtPayload): Promise<string> {
    const refreshToken = new RefreshToken();
    const token = await this.createToken(
      payload,
      '30d',
      keys.jwtModuleConfig.refreshSecret,
    );

    refreshToken.token = await bcrypt.hash(token, 10);
    refreshToken.userId = payload.sub;

    await this.refreshTokenRepository.save(refreshToken);

    return token;
  }

  async verifyToken(token: string): Promise<string> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: keys.jwtModuleConfig.secret,
      });

      return payload.sub;
    } catch (e) {
      throw new ServiceError(ServiceErrorKey.Unauthorized);
    }
  }

  async register(createUserDto: RegisterDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.userService.create({
      ...createUserDto,
      password: hashedPassword,
    });
    try {
      if (user && user.password) delete user.password;
      return user;
    } catch (e) {
      throw new ServiceError(ServiceErrorKey.AlreadyExists);
    }
  }

  async login(
    loginUserDto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const currentUser = await this.userService.findOne(
      loginUserDto.email,
      loginUserDto.username,
    );

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

    return {
      accessToken: await this.createAccessToken(payload),
      refreshToken: await this.createRefreshToken(payload),
    };
  }

  async logout(refreshToken: string): Promise<void> {
    const result = await this.refreshTokenRepository.delete({
      token: refreshToken,
    });

    if (result.affected === 0) {
      throw new ServiceError(ServiceErrorKey.Unauthorized);
    }
  }
}
