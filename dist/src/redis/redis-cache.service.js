"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisCacheService = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
let RedisCacheService = class RedisCacheService {
    cacheManager;
    constructor(cacheManager) {
        this.cacheManager = cacheManager;
    }
    async get(key) {
        try {
            return await this.cacheManager.get(key);
        }
        catch (error) {
            console.error(`Error getting cache key ${key}:`, error);
            return undefined;
        }
    }
    async set(key, value, ttl) {
        try {
            const ttlMs = ttl ? ttl * 1000 : undefined;
            await this.cacheManager.set(key, value, ttlMs);
        }
        catch (error) {
            console.error(`Error setting cache key ${key}:`, error);
        }
    }
    async del(key) {
        try {
            await this.cacheManager.del(key);
        }
        catch (error) {
            console.error(`Error deleting cache key ${key}:`, error);
        }
    }
    async reset() {
        try {
            await this.cacheManager.reset();
        }
        catch (error) {
            console.error('Error resetting cache:', error);
        }
    }
    async has(key) {
        try {
            const value = await this.cacheManager.get(key);
            return value !== undefined;
        }
        catch (error) {
            console.error(`Error checking cache key ${key}:`, error);
            return false;
        }
    }
};
exports.RedisCacheService = RedisCacheService;
exports.RedisCacheService = RedisCacheService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object])
], RedisCacheService);
//# sourceMappingURL=redis-cache.service.js.map