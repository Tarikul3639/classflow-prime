import { SetMetadata } from '@nestjs/common';
import type { EnrollmentRole } from '../../../infrastructure/database/interface/enrollment.interface';

/**
 * ClassRole Decorator
 * Restricts access based on user's role in a class (enrollment role)
 *
 * Usage:
 * @ClassRole('instructor')
 * @Post('assign-assistant')
 * async assignAssistant() { ... }
 *
 * @ClassRole('instructor', 'assistant')
 * @Get('members')
 * async getMembers() { ... }
 */

export const CLASS_ROLE_KEY = 'classRole';
export const ClassRole = (...roles: EnrollmentRole[]) =>
  SetMetadata(CLASS_ROLE_KEY, roles);
