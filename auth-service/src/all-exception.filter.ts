import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseRpcExceptionFilter, RpcException } from '@nestjs/microservices';
import { FileLogger } from './logger/file.logger';

@Catch()
export class AllExceptionsFilter extends BaseRpcExceptionFilter {
  private readonly logger = new FileLogger(AllExceptionsFilter.name);
  catch(exception: any, host: ArgumentsHost) {
    if (!(exception instanceof RpcException)) {
      exception = new RpcException(exception.message ?? exception);
    }
    this.logger.error(exception.message ?? exception);
    return super.catch(exception, host);
  }
}
