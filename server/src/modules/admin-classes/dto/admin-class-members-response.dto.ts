import { UserStatus } from '../../../infrastructure/database/interface/user.interface';
import { EnrollmentRole } from '../../../infrastructure/database/interface/enrollment.interface';
import { PaginationResponseDto } from '../../../common/dto/pagination-response.dto';
import { ApiResponseDto } from '../../../common/dto/api-response.dto';

export class AdminClassMemberDto {
    enrollmentId!: string;
    userId!: string;
    name!: string;
    email!: string;
    avatarUrl?: string | null;
    emailVerified!: boolean;
    userStatus!: UserStatus;
    role!: EnrollmentRole;
    enrolledAt!: Date;
}

export type AdminClassMembersDto = ApiResponseDto<{
    members: AdminClassMemberDto[];
    pagination: PaginationResponseDto;
}>;