import { Module, Global } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisCacheService } from './redis-cache.service';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const redisHost = configService.get<string>('REDIS_HOST');
        const redisPort = configService.get<number>('REDIS_PORT');
        const nodeEnv = configService.get<string>('NODE_ENV');

        // Development: use memory cache (no Redis needed)
        if (nodeEnv === 'development' || !redisHost) {
          console.log('💾 Using memory cache for development');
          return {
            store: 'memory',
            ttl: 3600,
            max: 1000,
          };
        }

        // Production: use Redis
        console.log('🚀 Using Redis cache for production');
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
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class RedisModule {}
