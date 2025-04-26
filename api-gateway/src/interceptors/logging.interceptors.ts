import { FileLogger } from './../logger/file.logger';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new FileLogger(LoggingInterceptor.name);
  constructor() {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const body = request.body;

    this.logger.log(`[Request] ${method} ${url}`);

    const now = Date.now();
    const responseText = `${method} ${url} - ${Date.now() - now}ms`;
    const successText = `[Response] [Success] ${responseText}`;
    const failureText = `[Response] [Failed] ${responseText}`;
    return next.handle().pipe(
      tap({
        next: () => this.logger.log(successText),
        error: () => this.logger.log(failureText),
      }),
    );
  }
}
