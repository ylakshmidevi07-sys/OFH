import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip } = request;
    const requestId = request.headers['x-request-id'] || this.generateId();
    const userId = request.user?.sub || request.user?.id || 'anonymous';
    const startTime = Date.now();

    // Attach requestId to request for downstream use
    request.requestId = requestId;

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          this.logger.log(
            `${method} ${url} ${context.switchToHttp().getResponse().statusCode} ${duration}ms`,
            { requestId, userId, route: url, duration, ip },
          );
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          this.logger.error(
            `${method} ${url} ${error.status || 500} ${duration}ms — ${error.message}`,
            { requestId, userId, route: url, duration, ip },
          );
        },
      }),
    );
  }

  private generateId(): string {
    // Simple unique ID without uuid dependency
    return `${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 9)}`;
  }
}


