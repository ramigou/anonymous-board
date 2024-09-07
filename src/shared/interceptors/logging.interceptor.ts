// src/common/interceptors/logging.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Logger } from 'winston';
import { Inject } from '@nestjs/common';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(@Inject('winston') private readonly logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, params, query } = request;

    const now = Date.now();
    this.logger.info(`Incoming request: ${method} ${url}`, {
      body,
      params,
      query,
    });

    return next.handle().pipe(
      tap((response) => {
        const timeTaken = Date.now() - now;
        this.logger.info(
          `Outgoing response: ${method} ${url} - ${timeTaken}ms`,
          {
            response,
          },
        );
      }),
    );
  }
}
