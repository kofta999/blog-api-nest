import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator<{ userId: string; username: string }>(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return { userId: request.user.sub, username: request.user.username };
  },
);
