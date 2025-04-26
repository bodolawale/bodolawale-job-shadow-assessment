import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';
import { firstValueFrom } from 'rxjs';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authServiceClient: ClientProxy,
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const token = this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException({ message: 'Token not found' });
    try {
      const userFromToken = await firstValueFrom(
        this.authServiceClient.send('verifyToken', { token }),
      );

      if (!userFromToken) {
        throw new UnauthorizedException({
          message: 'Invalid Token',
        });
      }

      const tenantId = request.params.tenantId;
      const userFromDB = await firstValueFrom(
        this.userServiceClient.send('getUserByIdForAuth', {
          id: userFromToken.id,
          tenant_id: tenantId,
        }),
      );

      if (!userFromDB) {
        throw new UnauthorizedException({
          message: 'User from token not found',
        });
      }

      request['user'] = userFromDB;
    } catch (error) {
      throw error;
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authorization = request.headers.authorization;
    if (!authorization) return undefined;
    const [signature, token] = authorization.split(' ') ?? [];

    return signature === 'Bearer' ? token : undefined;
  }
}
