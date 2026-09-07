import { IsEnum } from 'class-validator';

import { ClassStatus } from '../../../infrastructure/database/interface/class.interface';

export class UpdateAdminClassStatusDto {
  @IsEnum(ClassStatus)
  status!: ClassStatus;
}