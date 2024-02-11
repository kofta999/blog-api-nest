import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { JwtPayload } from '../interfaces/jwtPayload.interface';

export const User = createParamDecorator<JwtPayload>(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
