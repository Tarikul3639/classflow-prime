import { IsBoolean } from 'class-validator';

export class UnblockAdminClassDto {
  @IsBoolean()
  isBlocked!: boolean;
}