import { IsBoolean } from 'class-validator';

export class UpdateAdminClassEnrollmentDto {
  @IsBoolean()
  allowEnroll!: boolean;
}