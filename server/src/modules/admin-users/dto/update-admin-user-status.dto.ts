import { IsEnum } from 'class-validator';

import { UserStatus } from '../../../infrastructure/database/interface/user.interface';

export class UpdateAdminUserStatusDto {
  @IsEnum(UserStatus)
  status!: UserStatus;
}