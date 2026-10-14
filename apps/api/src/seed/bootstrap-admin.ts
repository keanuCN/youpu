import 'dotenv/config';
import { PrismaService } from '../common/prisma.service';

/** 已验证邮箱完成注册后，由服务器操作者显式指定首个管理员。 */
async function main() {
  const args = process.argv.slice(2);
  const index = args.indexOf('--email');
  const email = index >= 0 ? args[index + 1]?.trim().toLowerCase() : undefined;
  const apply = args.includes('--apply');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('用法：bootstrap-admin.ts --email <邮箱> [--apply]');
  const prisma = new PrismaService();
  try {
    await prisma.$transaction(async tx => {
      // 避免两个操作者同时初始化不同的首个管理员。
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(208013)`;
      const account = await tx.account.findUnique({ where: { email } });
      if (!account) throw new Error('请先通过邮箱验证码完成注册；脚本不会绕过验证创建账号');
      if (account.status !== 'active' || !account.emailVerifiedAt) throw new Error('账号必须启用且已验证邮箱');
      if (account.role === 'admin') { console.log('指定账号已经是管理员'); return; }
      if (await tx.account.count({ where: { role: 'admin', status: 'active' } })) throw new Error('已存在管理员，请通过后台账号管理调整权限');
      if (!apply) { console.log('初始化条件满足；添加 --apply 设置首个管理员'); return; }
      await tx.account.update({ where: { id: account.id }, data: { role: 'admin' } });
      await tx.auditLog.create({ data: {
        actorId: account.id, action: 'account.bootstrap-admin', entity: 'account', entityId: account.id,
        before: { role: account.role, status: account.status }, after: { role: 'admin', status: account.status },
      } });
      console.log('首个管理员已设置，密码与其他账号资料未改变');
    });
  } finally { await prisma.$disconnect(); }
}
main().catch((error: unknown) => { console.error(error instanceof Error ? error.message : String(error)); process.exitCode = 1; });
