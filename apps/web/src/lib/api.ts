/**
 * 后端 API 接入点。
 *
 * 当前前端内容来自 src/data 内容包（原型阶段的站内数据），
 * 唯一实时链路是埋点上报 `track()` → POST /api/events（见 lib/track.ts）。
 * M2 起这里将补齐目录/详情/搜索等接口，内容层改为「API 优先、内容包回退」。
 */
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3001";
