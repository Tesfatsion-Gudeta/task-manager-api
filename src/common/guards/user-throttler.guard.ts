import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class UserThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(request: Record<string, any>): Promise<string> {
    // If the user is authenticated, limit by user ID
    if (request.user && request.user.id) {
      return String(request.user.id);
    }

    // Otherwise (e.g., login/register), limit by IP address
    return String(request.ip ?? '');
  }

  protected getRequestResponse(context: ExecutionContext) {
    const http = context.switchToHttp();
    return {
      req: http.getRequest(),
      res: http.getResponse(),
    };
  }
}
