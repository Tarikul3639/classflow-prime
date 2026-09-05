import { AdminDashboardStatsDto } from './admin-dashboard-stats.dto';
import { AdminDashboardUserDto } from './admin-dashboard-user.dto';
import { AdminDashboardClassDto } from './admin-dashboard-class.dto';

export class AdminDashboardResponseDto {
  stats!: AdminDashboardStatsDto;
  recentUsers!: AdminDashboardUserDto[];
  recentClasses!: AdminDashboardClassDto[];
}

export class AdminDashboardResponseWrapperDto {
  success!: boolean;
  message!: string;
  data!: AdminDashboardResponseDto;
}