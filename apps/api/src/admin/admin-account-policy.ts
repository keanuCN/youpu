import { BadRequestException } from '@nestjs/common';

export interface AccountAccessState {
  role: string;
  status: string;
}

export interface AccountAccessPatch {
  role?: string;
  status?: string;
}

export function assertAccountAccessChangeAllowed(
  target: AccountAccessState,
  activeAdminCount: number,
  patch: AccountAccessPatch,
): void {
  const nextRole = patch.role ?? target.role;
  const nextStatus = patch.status ?? target.status;
  const isFinalActiveAdmin = target.role === 'admin' && target.status === 'active' && activeAdminCount <= 1;

  if (isFinalActiveAdmin && (nextRole !== 'admin' || nextStatus !== 'active')) {
    throw new BadRequestException('不能停用或降级最后一个管理员');
  }
}
