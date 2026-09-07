import { IsEnum } from 'class-validator';

import { EnrollmentRole } from '../../../infrastructure/database/interface/enrollment.interface';

export class UpdateAdminClassMemberRoleDto {
  @IsEnum(EnrollmentRole)
  role!: EnrollmentRole;
}