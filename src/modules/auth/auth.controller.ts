import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from 'src/shared/pipes/validation.pipe';
import { RegisterDto, registerSchema } from './dto/register.dto';
import { loginSchema, LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import keys from 'src/config/keys';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/register')
  @Public()
  @UsePipes(new ZodValidationPipe(registerSchema))
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('/login')
  @HttpCode(200)
  @Public()
  @UsePipes(new ZodValidationPipe(loginSchema))
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const tokens = await this.authService.login(loginDto);

    response.cookie('refreshToken', tokens.refreshToken, {
      maxAge: keys.cookieConfig.maxAge,
      secure: true,
      sameSite: 'none',
      httpOnly: true,
    });

    return { accessToken: tokens.accessToken };
  }

  @Get('/logout')
  logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    console.log(request.cookies);
    const { refreshToken } = request.cookies;
    response.clearCookie('refreshToken');

    if (!refreshToken)
      throw new UnauthorizedException('Refresh Token not found');

    return this.authService.logout(refreshToken);
  }
}
