import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserPayload } from 'src/shared/interfaces/UserPayload';

export const User = createParamDecorator<UserPayload>(
  (data: unknown, ctx: ExecutionContext): UserPayload => {
    const request = ctx.switchToHttp().getRequest();
    return { userId: request.user.sub, username: request.user.username };
  },
);
