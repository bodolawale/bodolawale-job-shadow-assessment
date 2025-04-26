import { APP_GUARD } from '@nestjs/core';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

import { ProxyService } from './proxy';
import { UsersController } from './users/users.controller';
import { MicroservicesConfiguration } from './microservices';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/role.guard';
import { AuthController } from './auth/auth.controller';
import { TenantMiddleware } from './middlewares/tenant.middleware';

@Module({
  imports: [
    MicroservicesConfiguration,
    ThrottlerModule.forRoot([
      {
        // 5 requests in 10 seconds
        name: 'short',
        ttl: 10_000,
        limit: 5,
      },
      {
        // 100 requests in 1 minute
        name: 'long',
        ttl: 60_000,
        limit: 100,
      },
    ]),
  ],
  controllers: [AuthController, UsersController],
  providers: [
    ProxyService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes(UsersController, AuthController);
  }
}
