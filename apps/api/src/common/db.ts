/**
 * Prisma 客户端唯一再导出点：其余模块一律从这里引入，
 * 避免生成路径（prisma/generated/client）散落在业务代码里。
 * src/common/db.ts 与编译产物 dist/common/db.js 到该目录的相对深度一致（../../），故 dev 与 build 均可解析。
 */
export { Prisma, PrismaClient } from '../../prisma/generated/client';
