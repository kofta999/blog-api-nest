import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async createToken(payload: {
    sub: string;
    username: string;
  }): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }
}
