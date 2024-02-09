import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User as UserEntity } from 'src/modules/users/entities/user.entity';

export const User = createParamDecorator<UserEntity>(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
