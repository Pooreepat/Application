import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext | ExecutionContextHost) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
