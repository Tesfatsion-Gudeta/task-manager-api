import { ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
export declare class UserThrottlerGuard extends ThrottlerGuard {
    protected getTracker(context: ExecutionContext): Promise<string>;
    private getClientIdentifier;
    protected throwThrottlingException(context: ExecutionContext): Promise<void>;
}
