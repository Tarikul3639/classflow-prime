import { AdminDashboardStatsDto } from './admin-dashboard-stats.dto';
import { AdminDashboardUserDto } from './admin-dashboard-user.dto';
import { AdminDashboardClassDto } from './admin-dashboard-class.dto';
import { AdminUserVerificationDto } from './admin-user-verification.dto';
import { UserGrowthDto } from './user-growth.dto';

export class AdminDashboardResponseDto {
  stats!: AdminDashboardStatsDto;
  recentUsers!: AdminDashboardUserDto[];
  recentClasses!: AdminDashboardClassDto[];
  userVerification!: AdminUserVerificationDto;
  userStatistics!: UserGrowthDto[];
}

export class AdminDashboardResponseWrapperDto {
  success!: boolean;
  message!: string;
  data!: AdminDashboardResponseDto;
}