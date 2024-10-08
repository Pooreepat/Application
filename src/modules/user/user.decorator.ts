import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext | ExecutionContextHost) => {
    // console.log("------")
    // console.log(ctx.getArgByIndex(1).user);
    // console.log(ctx.switchToHttp().getRequest().user)
    console.log("------")
    console.log(ctx)
    console.log("------")
    const user = ctx.switchToHttp().getRequest().user;
    return user ? user : ctx.getArgByIndex(1).user;
  },
);
