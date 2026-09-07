import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../infrastructure/database/interface/user.interface';

export class UpdateAdminUserRoleDto {
    @ApiProperty({
        enum: UserRole,
        example: UserRole.ADMIN,
        description: 'New role for the user',
    })
    @IsEnum(UserRole)
    role!: UserRole;
}
