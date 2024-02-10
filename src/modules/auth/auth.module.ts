import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refreshToken.entity';
import { JwtModule } from '@nestjs/jwt';
import keys from 'src/config/keys';

@Module({
  controllers: [AuthController],
  exports: [AuthService],
  imports: [
    forwardRef(() => UsersModule),
    TypeOrmModule.forFeature([RefreshToken]),
    JwtModule.register({
      global: true,
      secret: keys.jwtConfig.secret,
      signOptions: {
        expiresIn: '10m',
      },
    }),
  ],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}
