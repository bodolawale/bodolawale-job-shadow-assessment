import { ClientProxy } from '@nestjs/microservices';
import { Request, Response } from 'express';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { MICROSERVICES } from './types/application.types';

type ServicePayload = Record<string, any> & {
  tenant_id: string;
  callerUser?: any;
};

@Injectable()
export class ProxyService {
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
    @Inject('AUTH_SERVICE') private readonly authServiceClient: ClientProxy,
  ) {}

  async send(
    request: Request & { user?: any },
    data: Record<string, any>,
    service: string,
    pattern: string,
  ) {
    let svc: ClientProxy | null = null;
    switch (service) {
      case MICROSERVICES.USER_SERVICE:
        svc = this.userServiceClient;
        break;
      case MICROSERVICES.AUTH_SERVICE:
        svc = this.authServiceClient;
        break;
    }

    if (!svc) {
      throw new HttpException(
        `Unknown Service: ${service}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const payload = this.toServicePayload(request, data);
      const response = await firstValueFrom<Record<string, any>>(
        svc.send(pattern, payload),
      );
      return response;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  private toServicePayload(
    req: Request & { user?: any },
    data: Record<string, any>,
  ): ServicePayload {
    return {
      ...data,
      tenant_id: req.params.tenantId,
      callerUser: req.user,
    };
  }
}
