"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserThrottlerGuard = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
let UserThrottlerGuard = class UserThrottlerGuard extends throttler_1.ThrottlerGuard {
    async getTracker(req) {
        if (req.user?.id) {
            return `user:${req.user.id}`;
        }
        return this.getClientIdentifier(req);
    }
    getClientIdentifier(req) {
        let ip = 'unknown';
        if (req.ip) {
            ip = req.ip;
        }
        else if (req.connection?.remoteAddress) {
            ip = req.connection.remoteAddress;
        }
        else if (req.socket?.remoteAddress) {
            ip = req.socket.remoteAddress;
        }
        else if (req.headers?.['x-forwarded-for']) {
            ip = req.headers['x-forwarded-for'].split(',')[0].trim();
        }
        const cleanIp = ip.replace(/^::ffff:/, '').replace(/[^a-fA-F0-9.:]/g, '');
        return `ip:${cleanIp}`;
    }
    async canActivate(context) {
        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest();
        const response = httpContext.getResponse();
        try {
            return await super.canActivate(context);
        }
        catch (error) {
            if (error instanceof throttler_1.ThrottlerException) {
                const tracker = await this.getTracker(request);
                const isUserBased = tracker.startsWith('user:');
                console.log(`Rate limit exceeded for ${tracker} on ${request.url}`);
                if (isUserBased) {
                    throw new throttler_1.ThrottlerException('Too many requests for your account. Please try again later.');
                }
                else {
                    throw new throttler_1.ThrottlerException('Too many requests from your network. Please try again later.');
                }
            }
            throw error;
        }
    }
};
exports.UserThrottlerGuard = UserThrottlerGuard;
exports.UserThrottlerGuard = UserThrottlerGuard = __decorate([
    (0, common_1.Injectable)()
], UserThrottlerGuard);
//# sourceMappingURL=user-throttler.guard.js.map