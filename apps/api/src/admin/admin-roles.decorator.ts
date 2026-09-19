import { SetMetadata } from '@nestjs/common';
import type { AdminRole } from './admin-permissions';

export const ADMIN_ROLES_METADATA = 'youpu:admin-roles';

export const AdminRoles = (...roles: AdminRole[]) => SetMetadata(ADMIN_ROLES_METADATA, roles);
