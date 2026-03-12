import { SetMetadata } from '@nestjs/common';
import type { UserRole } from '../../database/entities/user.entity';

/**
 * Roles Decorator
 * Restricts access to routes based on user roles
 * 
 * Usage:
 * @Roles('admin', 'teacher')
 * @Get('admin-only')
 * async adminRoute() {
 *   return { message: 'Admin access granted' };
 * }
 */
export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);