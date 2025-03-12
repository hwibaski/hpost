import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthProviderDec = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
