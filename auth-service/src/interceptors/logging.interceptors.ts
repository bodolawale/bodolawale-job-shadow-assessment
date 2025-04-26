import { FileLogger } from './../logger/file.logger';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new FileLogger(LoggingInterceptor.name);
  constructor() {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToRpc();
    const content = request.getContext();
    const method = content.args[1];

    this.logger.log(`[Request] [Method: ${method}]`);

    const now = Date.now();
    const responseText = `[Method: ${method}] - ${Date.now() - now}ms`;
    const successText = `[Response] [Success] ${responseText}`;
    const failureText = `[Response] [Failed] ${responseText}`;
    return next.handle().pipe(
      tap({
        next: () => this.logger.log(successText),
        error: () => this.logger.error(failureText),
      }),
    );
  }
}
