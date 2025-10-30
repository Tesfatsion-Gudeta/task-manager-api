import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerException } from '@nestjs/throttler';

@Injectable()
export class UserThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(context: ExecutionContext): Promise<string> {
    const request = context.switchToHttp().getRequest();

    // For authenticated users, use their ID
    if (request.user?.id) {
      return `user:${request.user.id}`;
    }

    // For unauthenticated requests, use IP but with better handling
    return this.getClientIdentifier(request);
  }

  private getClientIdentifier(request: any): string {
    // Try multiple ways to get the client IP
    const ip =
      request.ip ||
      request.connection?.remoteAddress ||
      request.socket?.remoteAddress ||
      request.headers['x-forwarded-for']?.split(',')[0]?.trim() || // For proxies
      'unknown';

    // Clean the IP string and use it as identifier
    return `ip:${ip.replace(/[^a-fA-F0-9.:]/g, '')}`;
  }

  // Override to add custom headers or logging-optional step
  protected async throwThrottlingException(
    context: ExecutionContext,
  ): Promise<void> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const tracker = await this.getTracker(context);
    const isUserBased = tracker.startsWith('user:');

    console.log(`Rate limit exceeded for ${tracker} on ${request.url}`);

    // Custom error message based on limit type
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
}
