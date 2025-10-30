import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerException } from '@nestjs/throttler';

@Injectable()
export class UserThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    // For authenticated users, use their ID
    if (req.user?.id) {
      return `user:${req.user.id}`;
    }

    // For unauthenticated requests, use IP
    return this.getClientIdentifier(req);
  }

  private getClientIdentifier(req: any): string {
    // Get IP from various possible locations
    let ip = 'unknown';

    if (req.ip) {
      ip = req.ip;
    } else if (req.connection?.remoteAddress) {
      ip = req.connection.remoteAddress;
    } else if (req.socket?.remoteAddress) {
      ip = req.socket.remoteAddress;
    } else if (req.headers?.['x-forwarded-for']) {
      ip = req.headers['x-forwarded-for'].split(',')[0].trim();
    }

    // Clean the IP (remove IPv6 prefix if present)
    const cleanIp = ip.replace(/^::ffff:/, '').replace(/[^a-fA-F0-9.:]/g, '');
    return `ip:${cleanIp}`;
  }

  // Handle the rate limiting logic with proper context
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const response = httpContext.getResponse();

    try {
      return await super.canActivate(context);
    } catch (error) {
      if (error instanceof ThrottlerException) {
        // Customize the error based on user vs IP limiting
        const tracker = await this.getTracker(request);
        const isUserBased = tracker.startsWith('user:');

        console.log(`Rate limit exceeded for ${tracker} on ${request.url}`);

        if (isUserBased) {
          throw new ThrottlerException(
            'Too many requests for your account. Please try again later.',
          );
        } else {
          throw new ThrottlerException(
            'Too many requests from your network. Please try again later.',
          );
        }
      }
      throw error;
    }
  }
}
