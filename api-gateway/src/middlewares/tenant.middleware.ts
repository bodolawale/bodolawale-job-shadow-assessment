import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const tenantId: string = req.params.tenantId;

    if (!['tenant_1', 'tenant_2'].includes(tenantId)) {
      throw new HttpException('Invalid Tenant', HttpStatus.BAD_REQUEST);
    }
    next();
  }
}
