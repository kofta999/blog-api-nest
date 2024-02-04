import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { CreateUserDto, createUserSchema } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { ZodValidationPipe } from 'src/pipes/validation.pipe';
import { LoginUserDto, loginUserSchema } from './dto/login-user.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  @Public()
  @UsePipes(new ZodValidationPipe(createUserSchema))
  register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('/login')
  @HttpCode(200)
  @Public()
  @UsePipes(new ZodValidationPipe(loginUserSchema))
  login(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
  }
}
