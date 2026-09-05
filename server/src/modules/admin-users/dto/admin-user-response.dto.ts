import { AdminUserDto } from './admin-user.dto';

export class AdminUserResponseDto {
  users!: AdminUserDto[];

  total!: number;
  page!: number;
  limit!: number;
  totalPages!: number;
}