import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  imports: [ConfigModule], // This is important for ConfigService to be available
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}