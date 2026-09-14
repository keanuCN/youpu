import 'dotenv/config';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { env } from '../config/env';
import { resolveDataDir, runImport } from './importer';

/** seed 入口：pnpm --filter @youpu/api seed（可反复执行，幂等） */
async function main(): Promise<void> {
  const logger = new Logger('seed');
  const prisma = new PrismaService();
  try {
    const dataDir = resolveDataDir(env.DATA_DIR);
    logger.log(`导入源目录：${dataDir}`);
    const report = await runImport(prisma, dataDir);
    logger.log(`类目 ${report.categories} / 品牌 ${report.brands} / 产品 ${report.products} 导入完成`);
    if (report.errors.length > 0) {
      for (const err of report.errors) logger.error(err);
      logger.error(`共 ${report.errors.length} 处错误，数据未被导入 —— 校验未通过即数据质量闸门拦截`);
      process.exitCode = 1;
    }
  } finally {
    await prisma.$disconnect();
  }
}

void main();
