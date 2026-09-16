import 'dotenv/config';
import 'reflect-metadata';

// Prisma BigInt（event/notification id）JSON 序列化
(BigInt.prototype as unknown as { toJSON: () => string }).toJSON = function (this: bigint): string {
  return this.toString();
};

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from './config/env';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({ origin: env.CORS_ORIGINS.split(',').map((s) => s.trim()) });
  app.enableShutdownHooks();
  await app.listen(env.PORT, '127.0.0.1');
  new Logger('Bootstrap').log(`有谱 API 已启动：http://localhost:${env.PORT}/api`);
}

void bootstrap();
