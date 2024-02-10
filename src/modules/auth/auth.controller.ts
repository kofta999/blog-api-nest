import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from 'src/shared/pipes/validation.pipe';
import { RegisterDto, registerSchema } from './dto/register.dto';
import { loginSchema, LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';
import { AuthService } from './auth.service';

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
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
