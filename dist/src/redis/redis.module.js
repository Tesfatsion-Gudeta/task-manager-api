"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisModule = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const config_1 = require("@nestjs/config");
const redis_cache_service_1 = require("./redis-cache.service");
let RedisModule = class RedisModule {
};
exports.RedisModule = RedisModule;
exports.RedisModule = RedisModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            cache_manager_1.CacheModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => {
                    const redisHost = configService.get('REDIS_HOST');
                    const redisPort = configService.get('REDIS_PORT');
                    const nodeEnv = configService.get('NODE_ENV');
                    if (nodeEnv === 'development' || !redisHost) {
                        console.log('Using memory cache for development');
                        return {
                            store: 'memory',
                            ttl: 3600,
                            max: 1000,
                        };
                    }
                    console.log('Using Redis cache for production');
                    return {
                        store: require('cache-manager-redis-store'),
                        socket: {
                            host: redisHost,
                            port: redisPort || 6379,
                        },
                        ttl: 3600,
                        max: 1000,
                    };
                },
            }),
        ],
        providers: [redis_cache_service_1.RedisCacheService],
        exports: [redis_cache_service_1.RedisCacheService],
    })
], RedisModule);
//# sourceMappingURL=redis.module.js.map