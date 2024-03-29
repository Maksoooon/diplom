import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard, IAuthGuard } from '@nestjs/passport';

import { Register } from './auth.entity';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements IAuthGuard {
  public handleRequest(err: unknown, user: Register): any {
    return user;
  }

  public async canActivate(context: ExecutionContext) {
    await super.canActivate(context);

    const { user } = context.switchToHttp().getRequest();

    return !!user;
  }
}
